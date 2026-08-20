# controllers/

Route handler functions. Each controller file corresponds to one service domain and is consumed by the matching router file.

---

## Files

| File | Responsibility |
|------|---------------|
| `auth.controller.js` | Register, login, forgot/reset password |
| `user.controller.js` | Profile CRUD, avatar upload, dashboard stats, activity feed |
| `book.controller.js` | Book catalog listing, detail, and reservation |
| `borrowing.controller.js` | Borrow, return, renew, borrowing history |
| `movie.controller.js` | Movie catalog listing and detail |
| `movieRequest.controller.js` | Submit, list, and cancel movie requests |
| `product.controller.js` | Product catalog listing and detail |
| `order.controller.js` | Place order, order detail, order history |
| `review.controller.js` | List and create reviews for books and movies |
| `wishlist.controller.js` | Get, add, and remove wishlist items |
| `notification.controller.js` | Get, mark read, mark all read, delete all |
| `search.controller.js` | Cross-domain full-text search |
| `upload.controller.js` | File upload handler |
| `contact.controller.js` | Contact form submission and admin listing |
| `admin.controller.js` | Stats, recent items, content CRUD, movie request management |

---

## Conventions

- All handlers are `async (req, res, next)` — errors are forwarded via `next(err)` to the global error handler.
- ObjectId params are validated upstream by `validators/common.validators.js` before reaching controllers.
- Overdue status is resolved **on read** inside `borrowing.controller.js` (no background scheduler).
- Notification creation is fire-and-forget — failures are caught and logged but never bubble up.
