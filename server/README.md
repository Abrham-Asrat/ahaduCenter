# AhaduCenter Server

Express and Mongoose API for the AhaduCenter client. Start the API with `npm start` after configuring `server/.env` from `.env.example`.

## Seeding the Database

### Quick start

```bash
cd server
npm run seed:fresh
```

### Scripts

| Command | Purpose |
|---|---|
| `npm run seed` | Seed empty collections without clearing existing data |
| `npm run seed:fresh` | Clear seed collections and seed them again for development |
| `npm run seed:clear` | Clear seed collections only |
| `npm run seed:users` | Seed users only |
| `npm run seed:prod -- --force` | Production seed, only with explicit `--force` |

### Default test accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@ahadu.test` | `Admin@123` |
| User | `demo@ahadu.test` | `Demo@123` |

### Environment variables

```dotenv
MONGO_SEED_URI=
SEED_USERS=12
SEED_BOOKS=40
SEED_MOVIES=40
SEED_PRODUCTS=30
SEED_BORROWINGS=60
SEED_ORDERS=35
```

`MONGO_SEED_URI` is optional and overrides `MONGO_URI` for seed operations. Use `--only=users,books` or `--count=25` for targeted runs. See `src/seed/README.md` for live-schema mappings.

### Warning

Never run `seed:fresh` against production. The runner refuses production unless `--force` is supplied.
