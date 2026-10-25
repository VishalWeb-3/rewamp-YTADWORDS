# YouTube AdWords

React storefront (Vite + TinaCMS) with an Express API, Prisma and Neon PostgreSQL for users, orders and payments.

## Project Structure

```
youtubeadwords/
├── frontend/          # React + Vite app
│   ├── content/       # TinaCMS-edited JSON/MDX (pricing, page metadata, copy)
│   ├── src/
│   └── package.json
├── backend/           # Express API + Prisma + Neon PostgreSQL
│   ├── app.ts         # All routes (exported for tests)
│   ├── server.ts      # Starts the HTTP server
│   ├── lib/catalog.ts # Server-side price catalog
│   ├── data/          # Copy of the pricing JSON (refresh with npm run sync-catalog)
│   ├── prisma/
│   └── tests/
└── package.json       # Root scripts
```

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env: DATABASE_URL, FRONTEND_URL, payment keys
npm install
npm run db:push    # Sync schema to the database
npm run dev        # Start API at http://localhost:5001
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev:vite   # Start at http://localhost:5173 (proxies /api to the local backend)
npm run lint
```

### 3. Tests

The API tests need a disposable Postgres database; it is wiped on every run.

```bash
docker run -d --name ytadw-test-pg -e POSTGRES_USER=test -e POSTGRES_PASSWORD=test -e POSTGRES_DB=ytadw -p 55432:5432 postgres:16-alpine
cd backend
DATABASE_URL=postgresql://test:test@localhost:55432/ytadw npx prisma db push
npm test           # or set TEST_DATABASE_URL to use another database
```

## Pricing

Order prices are always computed on the server from `frontend/content/pricing` and `frontend/content/google-pricing`
(the files TinaCMS edits). The browser only sends a package reference (`slug`, `tier`, `quantity`).
`backend/data/` holds a copy for deployments without the frontend folder; `npm run build` refreshes it.

## API Endpoints (Backend)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/signup | – | Register (claims a guest account with the same email) |
| POST | /api/auth/login | – | Login with email or username |
| GET | /api/auth/me | cookie | Current user |
| POST | /api/auth/logout | cookie | Logout |
| GET | /api/cart | required | Own cart |
| POST | /api/cart/add | required | Add to own cart |
| DELETE | /api/cart/remove/:itemId | required | Remove own cart item |
| DELETE | /api/cart/clear | required | Clear own cart |
| POST | /api/orders/quote | – | Price packages without ordering |
| POST | /api/orders/create | optional | Create order and payment (card or crypto) |
| GET | /api/orders | required | Own orders |
| GET | /api/orders/detail/:orderId | required | Own order detail |
| GET | /api/orders/status/:externalOrderId | – | Payment status for the success page |
| POST | /api/webhooks/uplef | signature | Card payment updates |
| POST | /api/webhooks/cryptomus | signature | Crypto payment updates |
| POST | /api/tickets | – | Support ticket |
| POST | /api/reviews | – | Review (held for moderation) |
| POST | /api/payment-links | required | Create a pay-by-link |
| GET | /api/payment-links/:token | – | Public link details |
| POST | /api/payment-links/:token/pay | – | Start a link payment |
| GET | /api/merchant/payment-links | required | Own links |
| POST | /api/payment-links/:id/disable | required | Disable own link |
| GET | /api/youtube/search | – | YouTube channel suggestions |
| GET | /api/cta-actions/status | cookie | Feature toggles |
| GET | /api/health | – | Health check |

## Database

- **User**: email, username, password hash, name, guest and ban flags
- **CartItem**: amount, price, service, platform, username
- **Order**: amount, price, service, status, payment method, details (add-ons), external/gateway IDs
- **Ticket**, **Review**: contact form and review submissions
- **PaymentLink**, **LinkTransaction**: pay-by-link
