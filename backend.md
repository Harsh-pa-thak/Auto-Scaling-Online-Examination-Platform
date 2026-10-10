# Backend

The backend is an Express + Prisma + PostgreSQL API. It supports local
PostgreSQL, Neon, Supabase, Railway, AWS RDS, and other PostgreSQL providers.

## Environment

Copy `backend/.env.example` to `backend/.env` and set real private values:

```env
PORT=5000
DATABASE_URL=postgresql://USERNAME:PASSWORD@HOST:5432/DATABASE?sslmode=require
JWT_SECRET=use-a-long-random-secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
SEED_ADMIN_PASSWORD=development-admin-password
SEED_STUDENT_PASSWORD=development-student-password
```

Never commit `backend/.env`. `DATABASE_URL` must be a PostgreSQL connection
string. The application validates `DATABASE_URL` and `JWT_SECRET` at startup.

## Install and run

```bash
cd backend
npm install
npm run prisma:generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

The frontend Vite proxy sends `/api/*` to `http://localhost:5000`.

## Prisma

Schema: `backend/prisma/schema.prisma`

Models:

- `User`
- `Exam`
- `Question`
- `ExamQuestion`
- `Attempt`
- `AttemptAnswer`
- `Notification`

Migrations are stored in `backend/prisma/migrations/`. Use
`npx prisma migrate deploy` in a deployed environment.

Seed users:

```text
Admin:   admin@example.com / SEED_ADMIN_PASSWORD
Student: student@example.com / SEED_STUDENT_PASSWORD
```

## API

All responses use `{ data }` on success and
`{ error: { code, message, fields? } }` on failure.

### Health

```text
GET /api/health
```

### Auth

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

Protected requests use:

```text
Authorization: Bearer <jwt>
```

### Student

```text
GET  /api/student/dashboard
GET  /api/exams
GET  /api/exams/:id
POST /api/exams/:examId/attempts
GET  /api/attempts/:id
PUT  /api/attempts/:id/answers/:questionId
POST /api/attempts/:id/submit
GET  /api/student/results
GET  /api/student/history
GET  /api/student/notifications
```

Student exam responses never include `correctAnswer`.

### Admin

```text
GET    /api/admin/dashboard
GET    /api/students
PATCH  /api/students/:id/status
GET    /api/admin/exams
POST   /api/exams
PATCH  /api/exams/:id
DELETE /api/exams/:id
POST   /api/exams/:id/publish
GET    /api/questions
POST   /api/questions
PATCH  /api/questions/:id
DELETE /api/questions/:id
GET    /api/admin/monitoring
GET    /api/admin/results
GET    /api/admin/analytics
```

### Question assignment

```text
GET    /api/exams/:examId/questions
PUT    /api/exams/:examId/questions
PATCH  /api/exams/:examId/questions/:questionId
DELETE /api/exams/:examId/questions/:questionId
```

`PUT` replaces the complete assignment list. Each assignment has:

```json
{
  "questionId": "question-id",
  "position": 1
}
```

Question IDs and positions must be unique. Assignments cannot be changed after
an exam becomes active or completed.

## Attempt security

- Every attempt is queried with the authenticated student ID.
- Students cannot access another student's attempt.
- Attempts can only start while the exam is published/active and inside its
  schedule.
- Expiry is calculated by the server from the exam end time and duration.
- Answers must refer to a question assigned to that attempt's exam.
- Answers cannot be changed after submission or expiry.
- Submission and scoring run in a Prisma transaction.
- Repeated submission returns the already-finalized attempt.
- PostgreSQL advisory locking and a partial unique index prevent concurrent
  duplicate active attempts.
- Correct answers are only read by the server during scoring.

## Security middleware

The app includes Helmet, restricted CORS, JSON request-size limits, auth-route
rate limiting, JWT authentication, role authorization, Zod validation, and a
central error handler.
