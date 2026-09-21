# utils/

Shared helpers used by controllers and authentication middleware.

## Files

### `jwt.js`

Signs and verifies JSON Web Tokens using `JWT_SECRET`. Tokens contain the
authenticated user's id and role and expire after 24 hours.

### `paginate.js`

Runs a count query and a paginated Mongoose query, returning the common
`data`, `totalCount`, `page`, `totalPages`, and `limit` response fields.

The helper clamps page numbers to at least 1 and page sizes to the range 1-100.