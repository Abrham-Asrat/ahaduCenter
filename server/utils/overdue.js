/**
 * Calculates the overdue fee for a borrowing in ETB (Ethiopian Birr).
 *
 * Formula:
 *   daysOverdue = max(0, floor((now - dueDate) / 86400000))
 *   fee = daysOverdue * OVERDUE_FEE_PER_DAY  (default: 1 ETB/day)
 *
 * @param {Date} dueDate - The date the item was due
 * @param {Date} [now=new Date()] - The reference "current" date (injectable for testing)
 * @returns {number} fee in ETB — 0 if not overdue
 */
function calculateOverdueFee(dueDate, now = new Date()) {
  const MS_PER_DAY = 86400000;
  const daysOverdue = Math.max(0, Math.floor((now - dueDate) / MS_PER_DAY));
  const ratePerDay  = Number(process.env.OVERDUE_FEE_PER_DAY ?? 1);
  return daysOverdue * ratePerDay;
}

module.exports = { calculateOverdueFee };
