# utils/

Pure utility helpers shared across the application.

---

## Files

### `jwt.js`

```js
sign(payload)   // Signs with JWT_SECRET, expires in 24 h
verify(token)   // Verifies and decodes; throws on invalid/expired
```

Payload shape: `{ id: string, role: "user" | "admin" }`.

---

### `paginate.js`

```js
async paginate(model, filter, { page, limit, sort, select, populate })
// Returns: { data, totalCount, page, totalPages, limit }
```

Reusable pagination helper used by all list endpoints. Applies `filter` for the total count query, then chains `.skip((page-1)*limit).limit(limit).sort(sort)` for the data query.

Default values: `page = 1`, `limit = 20`, max `limit = 100`.

Response envelope used consistently across all domains:

```json
{
  "data": [...],
  "totalCount": 42,
  "page": 1,
  "totalPages": 3,
  "limit": 20
}
```
