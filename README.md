# Auto-Scaling Online Examination Platform

A full-stack online examination platform for conducting online examinations with live monitoring, admin controls, and student interfaces.

## Project Structure

```
.
├── frontend/                # React + Vite app (port 5173)
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── App.css
│   │   ├── lib/
│   │   │   └── api.js
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── components/
│   │   │   ├── common/          # Reusable UI components (Button, Card, Modal, etc.)
│   │   │   ├── student/         # Student-facing components (ExamCard, StudentNavbar, etc.)
│   │   │   └── admin/           # Admin-facing components (AdminDashboard, AdminMonitoringPage, etc.)
│   │   ├── data/                # Mock data and utilities
│   │   │   └── mockData.js
│   │   ├── routes/              # App routing (AppRoutes.jsx, RoutePlaceholder.jsx)
│   │   ├── layouts/             # Page layout components (AdminLayout, StudentLayout, AuthLayout)
│   │   └── pages/               # Page components (exam, auth, admin, student)
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── index.html
│
├── backend/                 # Express REST API (port 5000)
│   ├── src/
│   │   ├── index.js           # Entry point with Prisma and Express setup
│   │   ├── routes/            # API routes (auth, exams, students, attempts, questions, admin)
│   │   │   ├── auth.js
│   │   │   ├── exams.js
│   │   │   ├── students.js
│   │   │   ├── attempts.js
│   │   │   ├── questions.js
│   │   │   └── admin.js
│   │   ├── middleware/          # Auth and validation middleware (auth.js, errorHandler.js, validate.js)
│   │   ├── config/              # Database and environment config (prisma.js, env.js)
│   │   └── prisma/              # Database schema and migrations (schema.prisma, seed.js)
│   ├── .env                   # Environment variables (DATABASE_URL, JWT secrets, etc.)
│   └── package.json
│
└── .gitignore
```

## Getting Started

### Backend

```bash
cd backend
npm install
npm run dev        # starts the Express server with nodemon (Node 18+)
```

API available at `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
npm run dev        # starts Vite dev server
```

App available at `http://localhost:5173`

> The Vite dev server proxies all `/api/*` requests to `http://localhost:5000`, so no CORS issues during development.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Server health check |
| POST | `/api/auth/register` | Register a new user (student or admin) |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/me` | Get current user profile |
| POST | `/api/exams` | Create a new exam (admin only) |
| GET | `/api/exams` | List all exams |
| GET | `/api/exams/:id` | Get exam details |
| POST | `/api/exams/:examId/attempts` | Start an exam attempt (student) |
| GET | `/api/attempts/:id` | Get attempt details |
| PUT | `/api/attempts/:id/answers/:questionId` | Submit answer for a question |
| POST | `/api/attempts/:id/submit` | Submit exam attempt |
| GET | `/api/admin/dashboard` | Admin dashboard stats |
| GET | `/api/admin/monitoring` | Live monitoring - in-progress attempts |
| GET | `/api/admin/analytics` | Platform-wide analytics |
| GET | `/api/admin/exams` | List all exams (admin) |
| GET | `/api/admin/results` | Submission results (admin) |
| GET | `/api/students` | List students (admin) |

## Key Features

### Student Experience
- Browse and select exams to take
- Real-time exam timer with countdown
- Answer questions with multiple-choice options
- Submit exam attempts and view scores
- View exam history and results
- Live exam monitoring during active attempts

### Admin Experience
- Create and manage exams, questions, and options
- Monitor live exam sessions in real-time
- View analytics: average scores, pass rates, student performance
- Manage student accounts and exam assignments
- Browse submission results with detailed answer breakdown

### Live Monitoring (Admin)
The **Admin Monitoring Page** (`/admin/monitoring`) is the centerpiece of the live monitoring feature. It:

- **Fetches real data** from `GET /api/admin/monitoring` - shows all in-progress attempts with associated exam and student information
- **Dynamically groups** attempts by exam, showing how many students are in session per exam
- **Auto-refreshes every 30 seconds** without WebSockets, keeping the board live
- **Shows countdown timers** counting down to exam window close per exam
- **Allows filtering** by exam or searching for specific candidates
- **Displays a candidate sessions table** with student names, exam titles, start times, and time remaining
- **Updates in real-time** as students start/submit attempts

The monitoring page pulls from the backend `Prisma` ORM querying `attempts` with `status: 'IN_PROGRESS'`, including associated `exam` and `student` data.

## Tech Stack

- **Frontend**: React 18, Vite 5, Tailwind CSS 3
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: PostgreSQL via `DATABASE_URL`
- **Authentication**: JWT-based with role (STUDENT/ADMIN) enforcement

## Screenshots

### Login Page

<!-- Add login page screenshot here -->

### Live Monitoring Page

<!-- Add live monitoring page screenshot here -->

### VPC

<!-- Add VPC screenshot here -->

### Public and Private Subnets

<!-- Add public and private subnets screenshot here -->

---

> **Note**: The screenshot sections above are placeholders for the application and network screenshots.

## Available Scripts

### Frontend (`frontend/`)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server (port 5173) |
| `npm run build` | Build production bundle |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

### Backend (`backend/`)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Express server with nodemon |
| `npm run build` | Not applicable (Node.js) |
| `npm run seed` | Seed database with sample data |
| `npm test` | Run tests (if configured) |

## Deployment

### Local development

1. Build frontend: `cd frontend && npm run build`
2. Start backend: `cd backend && npm run dev`
3. Serve `frontend/dist/` with the Vite preview server or a static web server.

## Environment Variables

Create `.env` in both `frontend/` and `backend/` directories:

### Backend `.env` (local development only)
```
PORT=5000
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
JWT_SECRET=your-256-bit-secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
SEED_ADMIN_PASSWORD=123
SEED_STUDENT_PASSWORD=123
```

### Frontend `.env`
```
VITE_API_BASE_URL=http://localhost:5000
VITE_ENABLE_MONITORING=true
```

## License

This project is licensed under the MIT License.