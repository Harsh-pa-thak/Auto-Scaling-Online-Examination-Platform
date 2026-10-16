# Auto-Scaling Online Examination Platform

A full-stack web application for conducting online examinations with live monitoring, admin controls, and student interfaces.

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
- **Database**: PostgreSQL (Neon/Hosted) via `DATABASE_URL`
- **Authentication**: JWT-based with role (STUDENT/ADMIN) enforcement
- **Deployment**: Cloudflare Workers compatible (frontend Vite build + backend Express)

## AWS Integration

The platform is designed to work with AWS services for scaling and deployment:

- **Amazon RDS / Neon**: PostgreSQL database hosting (already configured via `DATABASE_URL` in `.env`)
- **AWS Auto Scaling**: The platform architecture supports auto-scaling - the Express backend can run behind an Application Load Balancer with target tracking scaling policies
- **Amazon CloudFront**: Frontend assets can be distributed via CloudFront CDN for global edge caching
- **AWS Lambda + API Gateway**: Backend API can be deployed as Lambda functions behind API Gateway for serverless scaling
- **Amazon S3**: Static asset storage (Vite build output) for CDN delivery
- **Amazon CloudWatch**: Monitoring and logs integration for the backend service
- **AWS IAM**: Role-based access control for admin operations

The `backend.md` file references the backend API structure, and the `DATABASE_URL` in `.env.example` already points to an AWS-hosted Neon PostgreSQL instance (`ep-blue-bar-zan27f8w-pooler.c-2.eu-west-2.aws.neon.tech`).

## Screenshots

### Live Monitoring Page (Admin)
![Live Monitoring Page](frontend/src/data/monitoring-screenshot.png)
*Admin live monitoring dashboard showing in-progress exam attempts, grouped by exam with countdown timers and candidate details.*

### Exam Interface (Student)
![Exam Interface](frontend/src/data/exam-interface.png)
*Student taking an exam with timer, questions, and answer options.*

### Admin Dashboard
![Admin Dashboard](frontend/src/admin-dashboard.png)
*Admin dashboard with stats, recent activity, and navigation.*

### Analytics Page
![Analytics](frontend/src/data/analytics.png)
*Platform-wide analytics showing attempt counts, average scores, and student performance.*

---

> **Note**: Screenshots above are placeholders. The actual live monitoring page dynamically renders data from the API in real-time. To capture actual screenshots, run `npm run dev` in both frontend and backend directories, then navigate to `http://localhost:5173/admin/monitoring` while an exam attempt is in progress.

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

### Traditional Deployment
1. Build frontend: `cd frontend && npm run build`
2. Start backend: `cd backend && npm run dev`
3. Serve static files from `frontend/dist/` via Express or your preferred web server

### Cloudflare Workers (Recommended for Auto-Scaling)
1. Deploy backend as a Cloudflare Worker (adapt Express to Worker fetch handler)
2. Deploy frontend static assets to Cloudflare R2 + CDN
3. Configure DNS with proper routing
4. Set up D1 database binding for Prisma ORM

### AWS Deployment (Full Stack)
1. **Database**: Use Amazon RDS (PostgreSQL) or Neon (serverless Postgres)
2. **Backend**: Deploy Node.js + Express to AWS Elastic Beanstalk, ECS Fargate, or Lambda
3. **Frontend**: Deploy to S3 + CloudFront with domain mapping
4. **CI/CD**: Set up GitHub Actions or GitLab CI for automated deployments
5. **Monitoring**: Configure CloudWatch dashboards for API latency, error rates, and attempt metrics

## Environment Variables

Create `.env` in both `frontend/` and `backend/` directories:

### Backend `.env`
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