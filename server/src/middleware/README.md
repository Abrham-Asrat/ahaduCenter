# middleware/

Express middleware used across all routes.

---

## Files

### `authenticate.js`

Reads the `Authorization: Bearer <token>` header, verifies the JWT using `utils/jwt.js`, and attaches `req.user = { id, role }`.

- Returns **401** if the header is missing, the token is malformed, or the token is expired.
- Applied to all protected routes.

### `requireRole.js`

Factory middleware: `requireRole(role)` returns a handler that checks `req.user.role`.

- Returns **403** if the role doesn't match or `req.user` is not set.
- Always used after `authenticate`.

```js
router.post('/admin/books', authenticate, requireRole('admin'), createBook);
```

### `validate.js`

Runs `validationResult(req)` after any `express-validator` rule chain. If errors exist, responds with **422** and a structured body:

```json
{
  "errors": [
    { "field": "email", "message": "Must be a valid email address" }
  ]
}
```

### `upload.js`

Configures `multer` with:
- **Storage**: `diskStorage` writing to `./uploads/` with a UUID-based filename
- **File filter**: accepts only `image/jpeg`, `image/png`, `image/webp`
- **Size limit**: 5 MB

Returns **413** on size exceeded, **415** on wrong MIME type.

### `errorHandler.js`

Express 4-argument global error handler (must be the last middleware in `app.js`).

| Error type | Status |
|-----------|--------|
| Mongoose `ValidationError` | 422 with per-field errors |
| Mongoose `CastError` | 400 |
| MongoDB duplicate key (`code 11000`) | 409 |
| Everything else | 500 |

Stack traces are **never** sent to the client.
