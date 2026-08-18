const mongoose = require('mongoose');
const { Schema } = mongoose;

const BorrowingSchema = new Schema({
  userId:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
  bookId:       { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  borrowDate:   { type: Date, default: Date.now },
  dueDate:      { type: Date, required: true },
  returnDate:   { type: Date, default: null },
  status:       { type: String, enum: ['Active', 'Returned', 'Overdue'], default: 'Active' },
  renewalsLeft: { type: Number, default: 2 },
  fee:          { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Borrowing', BorrowingSchema);
