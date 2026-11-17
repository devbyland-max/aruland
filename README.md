# StitchBear

E-commerce plushie shop (React + Express + Prisma + Stripe).

## Setup

```bash
# Start Postgres (port 5434)
docker compose up -d

# Root deps (concurrently)
npm install

# Client + server deps
npm install --prefix client
npm install --prefix server

# Env
copy .env.example server\.env
# Edit JWT_SECRET / Stripe keys as needed

# Database
npm run db:push
npm run db:seed

# Dev (API :5000 + Vite :5173)
npm run dev
```

## Env vars

| Variable | Required | Notes |
|----------|----------|--------|
| `DATABASE_URL` | yes | PostgreSQL (default host port `5434`) |
| `JWT_SECRET` | yes | ≥32 characters |
| `CLIENT_URL` | yes | e.g. `http://localhost:5173` |
| `STRIPE_SECRET_KEY` | checkout | Stripe test/live secret |
| `STRIPE_WEBHOOK_SECRET` | webhooks | Stripe webhook signing secret |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | seed | Creates ADMIN user on seed |

Default admin after seed: `admin@stitchbear.com` / `Admin123!`

## Scripts

- `npm run dev` — client + server
- `npm run db:push` — sync Prisma schema
- `npm run db:seed` — products, collections, admin

## Stripe

1. Add test keys to `server/.env`
2. Checkout creates a `PENDING` order + Stripe Checkout Session
3. Webhook `POST /api/webhooks/stripe` marks order `PAID` and decrements stock
4. Success/cancel URLs: `/checkout/success`, `/checkout/cancel`
