# validators/

`express-validator` rule chains. Each file exports arrays of validation rules that are spread into route definitions and followed by the `validate` middleware.

---

## Files

| File | Exports |
|------|---------|
| `common.validators.js` | `objectIdParam(field)`, `paginationRules` |
| `auth.validators.js` | `registerRules`, `loginRules`, `forgotPasswordRules`, `resetPasswordRules` |
| `user.validators.js` | `updateProfileRules` |
| `book.validators.js` | `bookQueryRules`, `bookBodyRules` |
| `movie.validators.js` | `movieQueryRules`, `movieBodyRules`, `movieRequestRules` |
| `product.validators.js` | `productQueryRules`, `productBodyRules` |
| `order.validators.js` | `orderBodyRules` |
| `review.validators.js` | `reviewRules` |
| `contact.validators.js` | `contactRules` |
| `search.validators.js` | `searchQueryRules` |

---

## Common validators

### `objectIdParam(field)`

Validates that a route parameter is a valid MongoDB ObjectId. Returns **400** (via `validate` middleware → 422) on failure.

```js
router.get('/:id', objectIdParam('id'), validate, getBook);
```

### `paginationRules`

Validates `page` (integer ≥ 1) and `limit` (integer 1–100) query parameters. Both are optional — defaults are applied in the controller or `paginate` helper.

---

## Usage pattern

```js
const { bookQueryRules } = require('../validators/book.validators');
const validate = require('../middleware/validate');

router.get('/', bookQueryRules, validate, listBooks);
```

The `validate` middleware runs after the rules and short-circuits with **422** if any rule fails.
