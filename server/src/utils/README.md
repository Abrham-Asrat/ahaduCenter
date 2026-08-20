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

---

### `overdue.js`

```js
calculateOverdueFee(dueDate, now = new Date())
// Returns: number (fee in ETB)
```

Linear fee formula:
```
daysOverdue = max(0, floor((now - dueDate) / 86_400_000))
fee = daysOverdue × OVERDUE_FEE_PER_DAY   (env var, default: 1)
```

Returns `0` if `dueDate` is in the future. This is a pure function with no side effects — tested directly with property-based tests in `__tests__/unit/overdue.test.js`.
