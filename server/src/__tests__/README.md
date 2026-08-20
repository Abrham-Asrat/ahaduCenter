# __tests__/

Test suite for the AhaduCenter backend. Uses **Jest 29** as the runner, **fast-check** for property-based testing, **Supertest** for HTTP assertions, and **mongodb-memory-server** for in-memory MongoDB instances.

---

## Running Tests

```bash
# From server/
npm test          # all 84 tests, serial execution
```

Tests run with `--runInBand` (serial) because each integration test file spins up its own `MongoMemoryServer` instance — parallel execution causes port contention and timeout failures.

---

## Structure

```
__tests__/
├── unit/          # Fast, isolated tests — no DB, no HTTP
└── integration/   # Full HTTP stack + in-memory MongoDB
```

---

## Unit Tests (`unit/`)

| File | What it tests |
|------|--------------|
| `jwt.test.js` | `utils/jwt.js` — sign/verify round-trip, expired token throws `TokenExpiredError` |
| `middleware.test.js` | `authenticate` (401 cases), `requireRole` (403 cases), `validate` (422 shape), `errorHandler` (500/400/409/422), CORS preflight (204 + headers) |
| `overdue.test.js` | `utils/overdue.js` — Property 13: fee = N × `OVERDUE_FEE_PER_DAY` for any N ≥ 0 |
| `paginate.test.js` | `utils/paginate.js` — Property 9: `totalPages = ceil(totalCount / limit)`, `data.length ≤ limit` |
| `order.total.test.js` | Order total logic — Property 16: `subtotal = Σ(price × qty)`, `totalPayableAtStore = subtotal + RESERVATION_FEE` |
| `upload.service.test.js` | `services/upload.service.js` — Property 18: 1000 UUID filenames are all distinct |

---

## Integration Tests (`integration/`)

Each file manages its own `MongoMemoryServer` + `mongoose.connect()` lifecycle (`beforeAll`/`afterAll`). Text indexes are explicitly created with `Model.createIndexes()` in `beforeAll`.

| File | Properties tested |
|------|------------------|
| `auth.test.js` | 1 (register→login round-trip), 2 (password never stored plaintext), 3 (forgot-password constant response) |
| `user.test.js` | 4 (profile update round-trip) |
| `book.filter.test.js` | 5 (search filter), 10 (borrow creates correct record), 11 (borrow→return restores copies), 12 (renew extends dueDate +14 days) |
| `movie.filter.test.js` | 6 (movie search filter) |
| `product.filter.test.js` | 7 (product search filter), 8 (price range filter — both bounds, min only, max only) |
| `review.rating.test.js` | 17 (aggregate rating = arithmetic mean after each review, for both Book and Movie) |
| `movieRequest.test.js` | 14 (title preserved after trim, status Pending), 15 (whitespace-only title rejected) |
| `search.test.js` | 20 (type filter isolates results to requested domain) |
| `validation.trim.test.js` | 19 (strings trimmed before persistence; empty-after-trim → 422) |

---

## Notes

- All integration tests mock `nodemailer` at the top of the file to prevent real email sends.
- `OVERDUE_FEE_PER_DAY` and `JWT_SECRET` env vars are set via `process.env` at the top of each file that needs them, before `require('../../app')`.
- Property-based tests use `numRuns: 3–20` depending on how DB-intensive each run is.
