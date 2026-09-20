# redux/

Redux Toolkit store and slice definitions.

---

## Files

### `store.js`

Configures the Redux store with all slices and exports `RootState` / `AppDispatch` types.

### `slices/`

| Slice | State managed |
|-------|--------------|
| `authSlice.js` | `token`, `user` (id, name, email, role), login/register/logout actions |
| `bookSlice.js` | Book catalog list, selected book, borrowings, pagination |
| `movieSlice.js` | Movie catalog list, selected movie, movie requests |
| `productSlice.js` | Product catalog list, selected product, orders |
| `wishlistSlice.js` | Wishlist items, add/remove actions |
| `notificationSlice.js` | Notification list, unread count, mark-read actions |
| `adminSlice.js` | Admin stats, recent items, managed content lists |

---

## Async Thunks

Each slice uses `createAsyncThunk` for API calls. The typical pattern:

```js
export const fetchBooks = createAsyncThunk('books/list', async (params) => {
  return await listBooks(params);   // from services/bookService.js
});
```

Loading, success, and error states are handled with `extraReducers` using `builder.addCase(thunk.pending/fulfilled/rejected)`.
