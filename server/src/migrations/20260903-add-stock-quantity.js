'use strict';

const mongoose = require('mongoose');

async function migrateProductStock() {
  const products = mongoose.connection.db.collection('products');
  await products.updateMany(
    { stockQuantity: { $exists: false } },
    [
      {
        $set: {
          stockQuantity: { $cond: ['$inStock', 1, 0] },
        },
      },
    ]
  );
}

if (require.main === module) {
  require('dotenv').config();
  const connectDB = require('../../config/db');
  connectDB()
    .then(migrateProductStock)
    .then(() => mongoose.disconnect())
    .catch(async (error) => {
      console.error(error.message);
      await mongoose.disconnect();
      process.exitCode = 1;
    });
}

module.exports = { migrateProductStock };
