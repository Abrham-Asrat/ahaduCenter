# routes/

Express routers. Each file maps HTTP methods + paths to controller functions and applies the appropriate middleware chain.

---

## Files

| File | Mounted at | Auth required |
|------|-----------|---------------|
| `auth.routes.js` | `/api/auth` | No |
| `user.routes.js` | `/api/users` | Yes (all routes) |
| `book.routes.js` | `/api/books` | Partial (catalog public; borrow/review requires auth) |
| `borrowing.routes.js` | `/api/borrowings` | Yes |
| `movie.routes.js` | `/api/movies` | Partial |
| `movieRequest.routes.js` | `/api/movie-requests` | Yes |
| `product.routes.js` | `/api/products` | No |
| `order.routes.js` | `/api/orders` | Yes |
| `notification.routes.js` | `/api/notifications` | Yes |
| `search.routes.js` | `/api/search` | No |
| `upload.routes.js` | `/api/uploads` | Yes + admin role |
| `contact.routes.js` | `/api/contact` | No |
| `admin.routes.js` | `/api/admin` | Yes + admin role (all routes) |

---

## Pattern

Every route follows the same middleware pipeline:

```
[authenticate?] → [requireRole?] → [validatorRules] → validate → controller
```

Review endpoints (`GET|POST /reviews`) are sub-routes defined inline in `book.routes.js` and `movie.routes.js` — they derive `itemType` from their mounting context.

Wishlist and notification list endpoints are defined in `user.routes.js` and delegate to `wishlist.controller.js` and `notification.controller.js`.
