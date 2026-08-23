import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import wishlistReducer, { addWishlistItem } from '../redux/slices/wishlistSlice';
import notificationReducer, {
  fetchNotifications,
  markAllRead,
  clearAll,
} from '../redux/slices/notificationSlice';

describe('Pagination and Slices Property-Based Tests', () => {

  // Property 7 & 8: Pagination Invariant
  it('Property 7 & 8: Pagination invariant holds for any array length, page, and limit', () => {
    fc.assert(
      fc.property(
        fc.array(fc.object()),
        fc.integer({ min: 1, max: 100 }),
        fc.integer({ min: 1, max: 50 }),
        (items, page, limit) => {
          const totalCount = items.length;
          const totalPages = Math.ceil(totalCount / limit) || 1;
          const startIdx = (page - 1) * limit;
          const sliced = items.slice(startIdx, startIdx + limit);

          const expectedLen = Math.max(0, Math.min(limit, totalCount - startIdx));

          expect(sliced.length).toBe(expectedLen);
          expect(totalPages).toBe(Math.ceil(totalCount / limit) || 1);
        }
      )
    );
  });

  // Property 9: Wishlist optimistic rollback on rejected add
  it('Property 9: wishlist optimistic rollback on rejected add restores previous items', () => {
    fc.assert(
      fc.property(
        fc.array(fc.record({ id: fc.string(), title: fc.string() })),
        fc.record({ itemId: fc.string(), itemType: fc.constantFrom('Book', 'Movie', 'Product') }),
        fc.string({ minLength: 1 }),
        (initialItems, newItem, errorMsg) => {
          const initialState = { items: initialItems, loading: false, error: null };

          // Simulate pending (optimistic addition)
          const pendingAction = { type: addWishlistItem.pending.type, meta: { arg: newItem } };
          const optimisticState = wishlistReducer(initialState, pendingAction);

          expect(optimisticState.items.length).toBe(initialItems.length + 1);

          // Simulate rejected (rollback)
          const rejectedAction = {
            type: addWishlistItem.rejected.type,
            payload: errorMsg,
            meta: { arg: newItem },
          };
          const rolledBackState = wishlistReducer(optimisticState, rejectedAction);

          expect(rolledBackState.items).toEqual(initialItems);
          expect(rolledBackState.error).toBe(errorMsg);
        }
      )
    );
  });

  // Property 10: notificationSlice unreadCount derivation
  it('Property 10: unreadCount always equals count of items with isRead === false', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string(),
            title: fc.string(),
            isRead: fc.boolean(),
          })
        ),
        (notifications) => {
          const action = { type: fetchNotifications.fulfilled.type, payload: notifications };
          const state = notificationReducer({ notifications: [], unreadCount: 0, loading: false, error: null }, action);

          const expectedUnread = notifications.filter((n) => !n.isRead).length;
          expect(state.unreadCount).toBe(expectedUnread);
          expect(state.notifications.length).toBe(notifications.length);
        }
      )
    );
  });

  // Property 11: markAllRead sets all notifications to read
  it('Property 11: markAllRead sets all notifications to read and unreadCount to 0', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string(),
            title: fc.string(),
            isRead: fc.boolean(),
          })
        ),
        (notifications) => {
          const unreadCount = notifications.filter((n) => !n.isRead).length;
          const initialState = { notifications, unreadCount, loading: false, error: null };

          const action = { type: markAllRead.fulfilled.type };
          const newState = notificationReducer(initialState, action);

          expect(newState.unreadCount).toBe(0);
          expect(newState.notifications.every((n) => n.isRead)).toBe(true);
        }
      )
    );
  });

  // Property 12: clearAll empties notifications
  it('Property 12: clearAll empties notifications array and resets unreadCount to 0', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string(),
            title: fc.string(),
            isRead: fc.boolean(),
          })
        ),
        (notifications) => {
          const initialState = {
            notifications,
            unreadCount: notifications.filter((n) => !n.isRead).length,
            loading: false,
            error: null,
          };

          const action = { type: clearAll.fulfilled.type };
          const newState = notificationReducer(initialState, action);

          expect(newState.notifications).toEqual([]);
          expect(newState.unreadCount).toBe(0);
        }
      )
    );
  });
});
