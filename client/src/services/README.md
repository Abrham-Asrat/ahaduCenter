# services/

Axios-based API service modules. Each file handles all HTTP calls for one domain.

---

## Files

| File | API domain |
|------|-----------|
| `api.js` | Axios instance — sets `baseURL` to `VITE_API_URL` and attaches the JWT `Authorization` header from Redux store on every request |
| `authService.js` | Register, login, forgot/reset password |
| `userService.js` | Profile, avatar, stats, activity, borrowings, orders, movie requests |
| `bookService.js` | Book catalog, borrow, return, renew, reserve |
| `movieService.js` | Movie catalog, movie requests |
| `productService.js` | Electronics catalog |
| `orderService.js` | Place order, order detail, order history |
| `searchService.js` | Cross-domain search |
| `adminService.js` | Admin stats, content CRUD, movie request management, contacts |

---

## Usage

All service functions return Axios response data directly (the `.data` field). Redux thunks in `src/redux/slices/` call these functions and handle loading/error state.

```js
import { listBooks } from '../services/bookService';

const books = await listBooks({ q: 'Dune', page: 1 });
```
