'use strict';

/**
 * Property-Based Tests: Overdue fee is linear (Property 13)
 * Validates: Requirements 5.8
 */

const fc = require('fast-check');
const { calculateOverdueFee } = require('../../utils/overdue');

const OVERDUE_FEE_PER_DAY = Number(process.env.OVERDUE_FEE_PER_DAY ?? 1);
const MS_PER_DAY = 86400000;

describe('calculateOverdueFee', () => {
  /**
   * Property 13: Overdue Fee Calculation Is Linear
   *
   * For any N >= 0 overdue days, fee === N * OVERDUE_FEE_PER_DAY
   *
   * **Validates: Requirements 5.8**
   */
  it('Property 13: fee is exactly N * OVERDUE_FEE_PER_DAY for any N overdue days', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 3650 }),
        (N) => {
          // Construct a dueDate that is exactly N days in the past
          const now = new Date();
          const dueDate = new Date(now.getTime() - N * MS_PER_DAY);

          const fee = calculateOverdueFee(dueDate, now);
          return fee === N * OVERDUE_FEE_PER_DAY;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 13 (edge): fee is 0 when dueDate is in the future
   *
   * **Validates: Requirements 5.8**
   */
  it('Property 13: fee is 0 when dueDate is in the future', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 3650 }),
        (N) => {
          // Construct a dueDate that is N days in the future
          const now = new Date();
          const dueDate = new Date(now.getTime() + N * MS_PER_DAY);

          const fee = calculateOverdueFee(dueDate, now);
          return fee === 0;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Concrete example checks
  it('returns 0 for a due date exactly at the current moment', () => {
    const now = new Date();
    expect(calculateOverdueFee(now, now)).toBe(0);
  });

  it('returns OVERDUE_FEE_PER_DAY for exactly 1 day overdue', () => {
    const now = new Date();
    const dueDate = new Date(now.getTime() - MS_PER_DAY);
    expect(calculateOverdueFee(dueDate, now)).toBe(1 * OVERDUE_FEE_PER_DAY);
  });

  it('returns 7 * OVERDUE_FEE_PER_DAY for exactly 7 days overdue', () => {
    const now = new Date();
    const dueDate = new Date(now.getTime() - 7 * MS_PER_DAY);
    expect(calculateOverdueFee(dueDate, now)).toBe(7 * OVERDUE_FEE_PER_DAY);
  });
});
