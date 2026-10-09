# Backend Setup and API

The backend is an Express REST API backed by PostgreSQL. AWS RDS is supported
through one connection string; credentials are never hard-coded.

## Environment

Copy the values into `backend/.env`:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://USER:PASSWORD@RDS_HOST:5432/DATABASE?sslmode=require
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
```

For AWS RDS, use the complete PostgreSQL connection URI supplied by AWS. In
production the application enables TLS for the pool. Do not commit real
credentials or the real RDS hostname if it is private.

## Run

```bash
cd backend
npm install
npm run dev
```

On startup, `src/db.js` creates the base tables if `DATABASE_URL` exists. The
current schema includes `users`, `exams`, `questions`, and `attempts`.

## Current routes

### Health

- `GET /api/health`

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

Login returns a JWT. Send it on protected requests:

```http
Authorization: Bearer <token>
```

### Exams

- `GET /api/exams`
- `GET /api/exams/:id`
- `POST /api/exams` (admin)
- `PATCH /api/exams/:id` (admin)
- `DELETE /api/exams/:id` (admin)

### Attempts

- `POST /api/exams/:examId/attempts`
- `GET /api/attempts/:id`
- `PUT /api/attempts/:id/answers`
- `POST /api/attempts/:id/submit`

## Frontend connection

The Vite proxy sends `/api/*` to `http://localhost:5000`. The shared client is
`frontend/src/lib/api.js`; frontend code should call relative API paths through
that client instead of using `fetch` directly.

## Important next backend additions

The basic foundation is in place. Add these next as the UI is wired:

- question CRUD and exam-question assignment
- student list/status endpoints
- results and server-side scoring
- notifications
- profile/password updates
- admin monitoring and analytics
- migrations and a controlled seed script
- rate limiting, request validation, audit logs, and automated tests

The server must remain authoritative for exam eligibility, time limits,
submission idempotency, scoring, and role permissions.
