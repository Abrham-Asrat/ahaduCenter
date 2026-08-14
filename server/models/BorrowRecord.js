const mongoose = require('mongoose');

const BorrowRecordSchema = new mongoose.Schema({}, { timestamps: true });

module.exports = mongoose.model('BorrowRecord', BorrowRecordSchema);
