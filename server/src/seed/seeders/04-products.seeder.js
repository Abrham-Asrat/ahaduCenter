'use strict';

/** Seeds electronics products from the curated catalog. */

const Product = require('../../models/Product');
const catalog = require('../data/productCatalog.json');
const { randomInt, pick, randomDateWithin, slugify } = require('../utils/random');

async function seedProducts(ctx) {
  const records = Array.from({ length: ctx.counts.products }, (_, index) => {
    const source = catalog[index % catalog.length];
    const name = `${source.name}${index >= catalog.length ? ` ${Math.floor(index / catalog.length) + 1}` : ''}`;
    const stockQuantity = randomInt(0, 25);
    return {
      name, brand: source.brand, category: source.category, price: source.price,
      condition: pick(['New', 'New', 'Refurbished']), description: `${name} is available from the Ahadu Center electronics catalog.`,
      images: [`https://picsum.photos/seed/product-${slugify(name)}-${index}/800/600`],
      highlights: ['Warranty included', 'Local pickup available', 'Quality checked'],
      specifications: source.specifications, stockQuantity, inStock: stockQuantity > 0,
      originalPrice: Math.round(source.price * 1.1), discount: 0,
      rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
      reviewCount: randomInt(0, 900), createdAt: randomDateWithin(365), updatedAt: new Date(),
    };
  });
  const products = await Product.create(records);
  ctx.products = products;
  return products;
}

module.exports = seedProducts;
