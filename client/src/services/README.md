# services/

Axios-based API service modules. Each file handles all HTTP calls for one domain.

---

## Files

| File | API domain |
|------|-----------|
| `api.ts` | Axios instance — sets `baseURL` from `VITE_API_BASE_URL` and attaches the JWT `Authorization` header on every request |
| `authService.ts` | Register, login, forgot/reset password |
| `userService.ts` | Profile, avatar, stats, activity, borrowings, orders, movie requests |
| `bookService.ts` | Book catalog, borrow, return, renew, reserve |
| `movieService.ts` | Movie catalog, movie requests |
| `productService.ts` | Electronics catalog |
| `orderService.ts` | Place order, order detail, order history |
| `searchService.ts` | Cross-domain search |
| `adminService.ts` | Admin stats, content CRUD, movie request management, contacts |

---

## Usage

All service functions return Axios response data directly (the `.data` field). Redux thunks in `src/redux/slices/` call these functions and handle loading/error state.

```ts
import { bookService } from '../services/bookService';

const books = await bookService.getBooks({ q: 'Dune', page: 1 });
```
