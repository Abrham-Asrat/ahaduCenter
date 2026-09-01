'use strict';

/**
 * wishlist.controller.js
 *
 * Handles all wishlist endpoints routed through /api/users/me/wishlist.
 *
 * Requirements covered:
 *   11.1 — GET  /api/users/me/wishlist            (getWishlist)
 *   11.2 — POST /api/users/me/wishlist            (addToWishlist)
 *   11.3 — 409 on duplicate wishlist entry         (addToWishlist)
 *   11.4 — DELETE /api/users/me/wishlist/:itemId   (removeFromWishlist)
 *   11.5 — 404 when wishlist item not found        (removeFromWishlist)
 *   11.7 — 400 on invalid itemId / unrecognised itemType (addToWishlist)
 */

const mongoose    = require('mongoose');
const WishlistItem = require('../models/WishlistItem.js');
const Book         = require('../models/Book.js');
const Product      = require('../models/Product.js');

// Lazy-load Movie to avoid potential circular dep issues (mirrors review.controller.js pattern)
function getMovieModel() {
  // eslint-disable-next-line global-require
  return require('../models/Movie.js');
}

/** Valid item types accepted by the Wishlist service */
const VALID_ITEM_TYPES = ['Movie', 'Book', 'Product'];

/**
 * Resolves the Mongoose model for the given itemType.
 * Returns null for unrecognised types.
 *
 * @param {'Movie'|'Book'|'Product'} itemType
 * @returns {import('mongoose').Model|null}
 */
function resolveModel(itemType) {
  if (itemType === 'Book')    return Book;
  if (itemType === 'Movie')   return getMovieModel();
  if (itemType === 'Product') return Product;
  return null;
}

/**
 * Maps a raw document from its domain model to the unified wishlist
 * response shape.
 *
 * Response fields per Requirement 11.1:
 *   id, type, title, imageUrl, rating, category, price, availability, link
 *
 * @param {object} doc      - Plain JS object from the domain model
 * @param {string} itemType - 'Movie' | 'Book' | 'Product'
 * @param {string} wishId   - WishlistItem._id (used as wishlist entry id)
 * @param {Date}   addedAt  - WishlistItem.addedAt
 * @returns {object}
 */
function buildResponseItem(doc, itemType, wishId, addedAt) {
  const id = doc._id ? doc._id.toString() : null;

  let title        = null;
  let imageUrl     = null;
  let rating       = doc.rating ?? 0;
  let category     = null;
  let price        = null;
  let availability = null;
  let link         = null;

  if (itemType === 'Book') {
    title        = doc.title ?? null;
    imageUrl     = doc.coverUrl ?? null;
    category     = doc.category ?? null;
    price        = doc.price ?? 0;
    availability = doc.availability ?? null;
    link         = `/books/${id}`;
  } else if (itemType === 'Movie') {
    title        = doc.title ?? null;
    imageUrl     = doc.posterUrl ?? null;
    category     = doc.genres && doc.genres.length > 0 ? doc.genres[0] : null;
    price        = null;           // Movies have no purchase price
    availability = 'Available';   // Movies are always browsable
    link         = `/movies/${id}`;
  } else if (itemType === 'Product') {
    title        = doc.name ?? null;
    imageUrl     = doc.images && doc.images.length > 0 ? doc.images[0] : null;
    category     = doc.category ?? null;
    price        = doc.price ?? null;
    availability = doc.inStock ? 'In Stock' : 'Out of Stock';
    link         = `/electronics/${id}`;
  }

  return {
    id:           wishId.toString(),
    type:         itemType,
    title,
    imageUrl,
    rating,
    category,
    price,
    availability,
    link,
    addedAt,
  };
}

// ── GET /api/users/me/wishlist ────────────────────────────────────────────────
// Requirement 11.1
//
// Fetches all WishlistItems for the authenticated user, then resolves each
// item's full data from the appropriate domain collection. Items whose source
// documents no longer exist are silently omitted from the response.
//
const getWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch all wishlist entries for this user, sorted newest-first
    const wishlistItems = await WishlistItem.find({ userId }).sort({ addedAt: -1 });

    if (wishlistItems.length === 0) {
      return res.status(200).json([]);
    }

    // Resolve full data for each wishlist entry in parallel
    const resolvedItems = await Promise.all(
      wishlistItems.map(async (entry) => {
        const Model = resolveModel(entry.itemType);
        if (!Model) return null; // Unrecognised type — skip silently

        const doc = await Model.findById(entry.itemId).lean();
        if (!doc) return null; // Source item deleted — skip silently

        return buildResponseItem(doc, entry.itemType, entry._id, entry.addedAt);
      })
    );

    // Filter out nulls (deleted or unrecognised items)
    const result = resolvedItems.filter(Boolean);

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// ── POST /api/users/me/wishlist ───────────────────────────────────────────────
// Requirements 11.2, 11.3, 11.7
//
// Validates itemId (valid ObjectId) and itemType (Movie|Book|Product),
// verifies the referenced item exists, then saves a new WishlistItem.
// Responds 201 with addedAt on success; 409 if item already in wishlist;
// 400 on validation failure.
//
const addToWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { itemId, itemType } = req.body;

    // ── Validate itemId ───────────────────────────────────────────────────────
    if (!itemId || !mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ error: 'itemId must be a valid ObjectId' });
    }

    // ── Validate itemType ─────────────────────────────────────────────────────
    if (!itemType || !VALID_ITEM_TYPES.includes(itemType)) {
      return res.status(400).json({
        error: `itemType must be one of: ${VALID_ITEM_TYPES.join(', ')}`,
      });
    }

    // ── Verify the referenced item exists ─────────────────────────────────────
    const Model = resolveModel(itemType);
    const existingItem = await Model.findById(itemId).lean();
    if (!existingItem) {
      return res.status(404).json({ error: `${itemType} with id ${itemId} not found` });
    }

    // ── Save the WishlistItem ─────────────────────────────────────────────────
    let wishlistEntry;
    try {
      wishlistEntry = await WishlistItem.create({ userId, itemId, itemType });
    } catch (createErr) {
      // Duplicate — compound unique index { userId, itemId } violation
      // Requirement 11.3
      if (createErr.code === 11000) {
        return res.status(409).json({ error: 'Item is already in your wishlist' });
      }
      throw createErr;
    }

    return res.status(201).json({
      id:       wishlistEntry._id,
      itemId:   wishlistEntry.itemId,
      itemType: wishlistEntry.itemType,
      addedAt:  wishlistEntry.addedAt,
    });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/users/me/wishlist/:itemId ─────────────────────────────────────
// Requirements 11.4, 11.5
//
// Finds a WishlistItem by { userId, itemId: params.itemId } and deletes it.
// Responds 200 on success; 404 if the entry is not found.
//
const removeFromWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;

    // Validate itemId param is a valid ObjectId before querying
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ error: 'itemId must be a valid ObjectId' });
    }

    const deleted = await WishlistItem.findOneAndDelete({ userId, itemId });

    if (!deleted) {
      return res.status(404).json({ error: 'Wishlist item not found' });
    }

    return res.status(200).json({ message: 'Item removed from wishlist' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
