'use strict';

/**
 * order.controller.js
 *
 * Handles all /api/orders endpoints plus the user order history endpoint
 * mounted at /api/users/me/orders.
 *
 * Requirements covered:
 *   9.1 — POST /api/orders             (placeOrder) — create order with product snapshots
 *   9.2 — 400/404 validation           (placeOrder)
 *   9.3 — GET  /api/users/me/orders    (getOrderHistory) — paginated order history
 *   9.4 — GET  /api/orders/:id         (getOrder) — full order document
 *   9.5 — 403 on forbidden access      (getOrder)
 *   9.6 — 404 on missing order         (getOrder)
 *   12.7 — createNotification side-effect on order placed (placeOrder)
 */

const Order   = require('../models/Order.js');
const Product = require('../models/Product.js');
const User    = require('../models/User.js');

// Notification service — imported with a try/catch guard so that if the
// service module is not yet implemented, placeOrder still functions correctly.
// (Requirements 12.7, 12.9: notification failures MUST NOT roll back the order)
let createNotification;
try {
  ({ createNotification } = require('../services/notification.service'));
} catch (_err) {
  createNotification = async () => {};
}

// RESERVATION_FEE defaults to 50 ETB if the env variable is not set
const RESERVATION_FEE = Number(process.env.RESERVATION_FEE ?? 50);

// ── POST /api/orders ──────────────────────────────────────────────────────────
// Requirements 9.1, 9.2, 12.7
const placeOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { items } = req.body;

    const requestedQuantities = new Map();
    items.forEach(({ productId, quantity }) => {
      requestedQuantities.set(productId, (requestedQuantities.get(productId) || 0) + quantity);
    });

    // Reserve inventory before creating the order. Each conditional update
    // succeeds only when the requested quantity is still available.
    const reservedProducts = [];
    try {
      for (const [productId, quantity] of requestedQuantities) {
        const numericProduct = await Product.findOneAndUpdate(
          { _id: productId, stockQuantity: { $gte: quantity } },
          { $inc: { stockQuantity: -quantity } },
          { new: true }
        );
        const product = numericProduct || (quantity === 1
          ? await Product.findOneAndUpdate(
              { _id: productId, stockQuantity: null, inStock: true },
              { $set: { stockQuantity: 0, inStock: false } },
              { new: true }
            )
          : null);
        if (!product) {
          const err = new Error(`Insufficient stock: ${productId}`);
          err.status = 409;
          throw err;
        }
        if (product.stockQuantity > 0 && !product.inStock) {
          await Product.findByIdAndUpdate(productId, { $set: { inStock: true } });
        }
        reservedProducts.push({ productId, quantity, product });
      }
    } catch (stockErr) {
      await Promise.all(
        reservedProducts.map(({ productId, quantity }) =>
          Product.findByIdAndUpdate(productId, { $inc: { stockQuantity: quantity } })
        )
      );
      if (stockErr.status === 409) {
        return res.status(409).json({ error: stockErr.message });
      }
      throw stockErr;
    }

    // Enrich each item with a product snapshot (price, name, first image)
    // and validate that every productId exists (Requirement 9.2)
    let enrichedItems;
    try {
      enrichedItems = await Promise.all(
        items.map(async ({ productId, quantity }) => {
          const product = reservedProducts.find((entry) => entry.productId === productId)?.product;
          if (!product) {
            const err = new Error(`Product not found: ${productId}`);
            err.status = 404;
            throw err;
          }
          return {
            productId,
            productName:  product.name,
            productImage: product.images && product.images.length > 0 ? product.images[0] : null,
            price:        product.price,
            quantity,
          };
        })
      );
    } catch (enrichErr) {
      await Promise.all(
        reservedProducts.map(({ productId, quantity }) =>
          Product.findByIdAndUpdate(productId, { $inc: { stockQuantity: quantity } })
        )
      );
      if (enrichErr.status === 404) {
        return res.status(404).json({ error: enrichErr.message });
      }
      throw enrichErr;
    }

    // Compute subtotal = sum(price × quantity) (Requirement 9.1)
    const subtotal = enrichedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // totalPayableAtStore = subtotal + RESERVATION_FEE (Requirement 9.1)
    const totalPayableAtStore = subtotal + RESERVATION_FEE;

    // Create the Order record with status "Processing" (Requirement 9.1)
    let order;
    try {
      order = await Order.create({
        userId,
        items:               enrichedItems,
        subtotal,
        reservationFee:      RESERVATION_FEE,
        totalPayableAtStore,
        status:              'Processing',
      });
    } catch (orderErr) {
      await Promise.all(
        reservedProducts.map(({ productId, quantity }) =>
          Product.findByIdAndUpdate(productId, {
            $inc: { stockQuantity: quantity },
            $set: { inStock: true },
          })
        )
      );
      throw orderErr;
    }

    // Fire-and-forget notification — failure MUST NOT roll back the order
    // (Requirements 12.7, 12.9)
    try {
      const itemSummary = enrichedItems
        .map((i) => `${i.productName} ×${i.quantity}`)
        .join(', ');

      await createNotification({
        userId,
        type:        'Electronics',
        title:       'Order Placed',
        description: `Your order has been placed. Items: ${itemSummary}. Total payable at store: ${totalPayableAtStore} ETB.`,
      });
    } catch (notifErr) {
      console.error('[placeOrder] Notification creation failed:', notifErr.message);
    }

    return res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

// ── GET /api/orders/:id ───────────────────────────────────────────────────────
// Requirements 9.4, 9.5, 9.6
const getOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const userId  = req.user.id;
    const role    = req.user.role;

    const order = await Order.findById(orderId).lean();

    // Requirement 9.6 — 404 if order does not exist
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Requirement 9.5 — 403 if the requesting user does not own the order and is not admin
    if (order.userId.toString() !== userId && role !== 'admin') {
      return res.status(403).json({ error: 'You do not have permission to view this order' });
    }

    // Populate customerName and phone from the owning User
    // (Requirement 9.4 — respond with customerName, phone, storeLocation, operatingHours, items,
    //  subtotal, reservationFee, totalPayableAtStore)
    const user = await User.findById(order.userId).select('name phone').lean();

    return res.status(200).json({
      ...order,
      customerName: user ? user.name : null,
      phone:        user ? user.phone : null,
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/users/me/orders ──────────────────────────────────────────────────
// Requirement 9.3
const getOrderHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const [orders, totalCount] = await Promise.all([
      Order.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments({ userId }),
    ]);

    // Map to the shape required by Requirement 9.3:
    // id, date, status, items (with product name and image), itemCount, total
    const data = orders.map((order) => ({
      id:        order._id.toString(),
      date:      order.createdAt,
      status:    order.status,
      items:     order.items.map((item) => ({
        productId:    item.productId,
        productName:  item.productName,
        productImage: item.productImage,
        price:        item.price,
        quantity:     item.quantity,
      })),
      itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
      total:     order.totalPayableAtStore,
    }));

    return res.status(200).json({
      data,
      page,
      limit,
      totalCount,
      totalPages: totalCount === 0 ? 0 : Math.ceil(totalCount / limit),
    });
  } catch (err) {
    next(err);
  }
};



module.exports = { placeOrder, getOrder, getOrderHistory };
