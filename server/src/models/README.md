# models/

Mongoose schema definitions. Each file exports a compiled Mongoose model.

---

## Files

| File | Collection | Key Notes |
|------|-----------|-----------|
| `User.js` | `users` | `email` unique index; passwords stored as bcrypt hash in `passwordHash`; `role`: `"user"` or `"admin"` |
| `Book.js` | `books` | Text index on `title`, `author`, `isbn` for full-text search |
| `Borrowing.js` | `borrowings` | Status: `Active` → `Overdue` (resolved on read) → `Returned` |
| `Reservation.js` | `reservations` | Status: `Reserved`, `Cancelled`, `Fulfilled` |
| `Movie.js` | `movies` | Text index on `title`, `director`; nested `CastMemberSchema` |
| `MovieRequest.js` | `movierequests` | Status: `Pending`, `Available`, `Fulfilled` |
| `Product.js` | `products` | Text index on `name`, `brand`, `category`; `specifications` is a `Map` |
| `Order.js` | `orders` | Nested `OrderItemSchema`; default store location set on schema |
| `Review.js` | `reviews` | Compound unique index `{ userId, itemId }` prevents duplicate reviews |
| `WishlistItem.js` | `wishlistitems` | Compound unique index `{ userId, itemId }` |
| `Notification.js` | `notifications` | `type` enum: `Books`, `Movies`, `Electronics`, `General` |
| `ContactSubmission.js` | `contactsubmissions` | Simple form data: name, email, subject, message |

---

## Naming

All text indexes must be explicitly created in test environments — call `Model.createIndexes()` in `beforeAll` when using `mongodb-memory-server`.
