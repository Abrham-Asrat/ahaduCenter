'use strict';

/** Seeds realistic borrowing history and reserved records using live enums. */

const Borrowing = require('../../models/Borrowing');
const Reservation = require('../../models/Reservation');
const { randomInt, randomDateWithin } = require('../utils/random');

function datePlusDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

async function seedBorrowings(ctx) {
  const requested = ctx.counts.borrowings;
  const borrowingCount = Math.max(0, requested - Math.min(5, requested));
  const records = [];
  for (let index = 0; index < borrowingCount; index += 1) {
    const user = ctx.users[index % ctx.users.length];
    const book = ctx.books[index % ctx.books.length];
    const isReturned = index >= 20 && index < 45;
    const isOverdue = index >= 45;
    const borrowDate = isReturned || isOverdue ? randomDateWithin(90) : randomDateWithin(30);
    const dueDate = isReturned ? datePlusDays(borrowDate, 14) : isOverdue ? datePlusDays(new Date(), -randomInt(1, 30)) : datePlusDays(new Date(), randomInt(1, 14));
    records.push({
      userId: user._id, bookId: book._id, borrowDate, dueDate,
      returnDate: isReturned ? datePlusDays(dueDate, -randomInt(1, 5)) : null,
      status: isReturned ? 'Returned' : isOverdue ? 'Overdue' : 'Active',
      renewalsLeft: randomInt(0, 2), createdAt: borrowDate, updatedAt: new Date(),
    });
  }
  const borrowings = await Borrowing.create(records);
  const reservationCount = requested - borrowingCount;
  const reservations = await Reservation.create(Array.from({ length: reservationCount }, (_, index) => ({
    userId: ctx.users[(index + 2) % ctx.users.length]._id,
    bookId: ctx.books[(index + 7) % ctx.books.length]._id,
    status: 'Reserved', reservationDate: randomDateWithin(30),
  })));
  ctx.borrowings = borrowings;
  ctx.reservations = reservations;
  return borrowings;
}

module.exports = seedBorrowings;
