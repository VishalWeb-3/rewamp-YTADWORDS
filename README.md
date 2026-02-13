# YouTube AdWords

Frontend + Backend structure with Neon PostgreSQL for users, carts, orders, and payments.

## Project Structure

```
youtubeadwords/
├── frontend/          # React + Vite app
│   ├── src/
│   ├── public/
│   ├── index.html
│   └── package.json
├── backend/           # Express API + Prisma + Neon PostgreSQL
│   ├── prisma/
│   ├── lib/
│   ├── server.ts
│   └── package.json
└── package.json       # Root scripts
```

## Setup

### 1. Backend (Neon PostgreSQL)

```bash
cd backend
cp .env.example .env
# Edit .env and add your Neon DATABASE_URL
npm install
npm run db:push    # Sync schema to Neon
npm run dev        # Start API at http://localhost:5001
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev        # Start at http://localhost:5173
```

### 3. Root Commands

```bash
npm run dev:frontend   # Start frontend
npm run dev:backend    # Start backend
npm run db:push        # Push Prisma schema to Neon
```

## API Endpoints (Backend)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Register user |
| POST | /api/auth/login | Login |
| GET | /api/cart/:userId | Get cart |
| POST | /api/cart/add | Add to cart |
| DELETE | /api/cart/remove/:itemId | Remove item |
| DELETE | /api/cart/clear/:userId | Clear cart |
| GET | /api/orders/:userId | List orders |
| GET | /api/orders/detail/:orderId | Order detail |
| POST | /api/orders/create | Create order |
| GET | /api/health | Health check |

## Database (Neon PostgreSQL)

- **User** – email, username, password, name
- **CartItem** – amount, price, service, platform, username
- **Order** – amount, price, service, status, paymentMethod

Frontend uses localStorage for now; integrate with these API endpoints to persist users, carts, and orders in Neon DB.
