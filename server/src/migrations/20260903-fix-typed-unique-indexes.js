'use strict';

const mongoose = require('mongoose');

const INDEXES = [
  {
    collection: 'reviews',
    oldName: 'userId_1_itemId_1',
    key: { userId: 1, itemId: 1, itemType: 1 },
  },
  {
    collection: 'wishlistitems',
    oldName: 'userId_1_itemId_1',
    key: { userId: 1, itemId: 1, itemType: 1 },
  },
];

async function migrateTypedIndexes() {
  const db = mongoose.connection.db;

  for (const index of INDEXES) {
    const collection = db.collection(index.collection);
    const duplicates = await collection.aggregate([
      {
        $group: {
          _id: { userId: '$userId', itemId: '$itemId', itemType: '$itemType' },
          ids: { $push: '$_id' },
          count: { $sum: 1 },
        },
      },
      { $match: { count: { $gt: 1 } } },
    ]).toArray();

    if (duplicates.length > 0) {
      throw new Error(`Cannot migrate ${index.collection}: ${duplicates.length} typed duplicates found`);
    }

    const existingIndexes = await collection.indexes();
    if (existingIndexes.some((existing) => existing.name === index.oldName)) {
      await collection.dropIndex(index.oldName);
    }
    await collection.createIndex(index.key, { unique: true });
  }
}

if (require.main === module) {
  require('dotenv').config();
  const connectDB = require('../../config/db');
  connectDB()
    .then(migrateTypedIndexes)
    .then(() => mongoose.disconnect())
    .catch(async (error) => {
      console.error(error.message);
      await mongoose.disconnect();
      process.exitCode = 1;
    });
}

module.exports = { migrateTypedIndexes };
