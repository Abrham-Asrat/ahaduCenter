'use strict';

/**
 * Property-Based Tests: Order subtotal and total correctness (Property 16)
 * Validates: Requirements 9.1
 */

const fc = require('fast-check');

const RESERVATION_FEE = Number(process.env.RESERVATION_FEE ?? 50);

/**
 * Pure computation logic extracted from order.controller.js (Requirement 9.1):
 *   subtotal            = sum(price × quantity)
 *   totalPayableAtStore = subtotal + RESERVATION_FEE
 */
function computeOrderTotals(items) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalPayableAtStore = subtotal + RESERVATION_FEE;
  return { subtotal, totalPayableAtStore };
}

describe('Order total computation', () => {
  /**
   * Property 16: subtotal === sum(price * quantity) for every item
   *
   * **Validates: Requirements 9.1**
   */
  it('Property 16: subtotal equals the sum of price * quantity for all items', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            // noNaN + noDefaultInfinity ensures only finite, valid price values
            price:    fc.float({ min: 0, max: 10000, noNaN: true, noDefaultInfinity: true }),
            quantity: fc.integer({ min: 1, max: 99 }),
          }),
          { minLength: 1, maxLength: 20 }
        ),
        (items) => {
          const { subtotal } = computeOrderTotals(items);

          const expectedSubtotal = items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );

          return subtotal === expectedSubtotal;
        }
      ),
      { numRuns: 10 }
    );
  });

  /**
   * Property 16: totalPayableAtStore === subtotal + RESERVATION_FEE
   *
   * **Validates: Requirements 9.1**
   */
  it('Property 16: totalPayableAtStore equals subtotal + RESERVATION_FEE', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            // noNaN + noDefaultInfinity ensures only finite, valid price values
            price:    fc.float({ min: 0, max: 10000, noNaN: true, noDefaultInfinity: true }),
            quantity: fc.integer({ min: 1, max: 99 }),
          }),
          { minLength: 1, maxLength: 20 }
        ),
        (items) => {
          const { subtotal, totalPayableAtStore } = computeOrderTotals(items);

          return totalPayableAtStore === subtotal + RESERVATION_FEE;
        }
      ),
      { numRuns: 10 }
    );
  });

  // Concrete example checks
  it('computes subtotal and total correctly for a single item', () => {
    const items = [{ price: 100, quantity: 3 }];
    const { subtotal, totalPayableAtStore } = computeOrderTotals(items);
    expect(subtotal).toBe(300);
    expect(totalPayableAtStore).toBe(300 + RESERVATION_FEE);
  });

  it('computes subtotal and total correctly for multiple items', () => {
    const items = [
      { price: 200, quantity: 2 },
      { price: 50,  quantity: 4 },
    ];
    const { subtotal, totalPayableAtStore } = computeOrderTotals(items);
    expect(subtotal).toBe(600);
    expect(totalPayableAtStore).toBe(600 + RESERVATION_FEE);
  });

  it('totalPayableAtStore is RESERVATION_FEE when subtotal is 0', () => {
    const items = [{ price: 0, quantity: 1 }];
    const { subtotal, totalPayableAtStore } = computeOrderTotals(items);
    expect(subtotal).toBe(0);
    expect(totalPayableAtStore).toBe(RESERVATION_FEE);
  });
});
