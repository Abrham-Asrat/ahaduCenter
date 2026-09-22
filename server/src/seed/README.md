# Database seed system

The seed runner uses the existing Mongoose schemas and creates connected demo data for local development and QA.

## Commands

```bash
cd server
npm run seed          # seed selected empty collections
npm run seed:fresh    # clear all seed collections, then seed
npm run seed:clear    # clear only
npm run seed:users    # seed users only
node src/seed/index.js --only=users,books
node src/seed/index.js --count=25
NODE_ENV=production node src/seed/index.js --force
```

The runner loads `server/.env`, prefers `MONGO_SEED_URI` over `MONGO_URI`, always disconnects, and refuses production without `--force`. Counts can be overridden with `SEED_USERS`, `SEED_BOOKS`, `SEED_MOVIES`, `SEED_PRODUCTS`, `SEED_BORROWINGS`, `SEED_ORDERS`, or the other `SEED_<RESOURCE>` variables in `seedConfig.js`.

## Default accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@ahadu.test` | `Admin@123` |
| User | `demo@ahadu.test` | `Demo@123` |

Passwords are stored as bcrypt hashes using the same cost factor (12) as the authentication controller.

## Live-schema mappings

The requested seed shape was adapted to the repository's current models without changing application logic:

- User profiles support only `name`, `email`, `passwordHash`, role, and verification fields. `staff`, phone, avatar, and address are not stored because the schema does not define them.
- Books use `year`, `coverUrl`, `location`, and `availableCopies`; unsupported names such as `publishedYear`, `coverImage`, and `shelfLocation` are mapped to the live equivalents.
- Movies use `year`, `genres`, `posterUrl`, and `description`; `releaseYear`, `genre`, `posterImage`, and `synopsis` are mapped to live fields.
- Products use `stockQuantity`, `images`, and the `specifications` string map. Requested `stock`, `specs`, and `rating` are mapped to live fields.
- Borrowing has only `Active`, `Returned`, and `Overdue`. The five requested reserved records are created in the existing `Reservation` collection.
- Movie requests support `Pending`, `Available`, and `Fulfilled`; requested `approved` maps to `Available`, while `rejected` is not representable.
- Orders support `Processing`, `Ready`, `Completed`, and `Cancelled`; requested pending/confirmed map to `Processing`, and order price totals/pickup codes are not schema fields.
- Reviews and wishlists use `userId`, `itemId`, and `itemType`; there is no separate Wishlist document.
- Notifications use `Books`, `Movies`, `Electronics`, and `General`, with `description`, `isRead`, and `timestamp`; requested notification names map to those domain types.
- Contact submissions have no status field, so contacts are seeded without one.

All relationships use IDs returned from inserted Mongoose documents. The old `src/seed.js` remains as legacy seed data, but package scripts now use this runner.
