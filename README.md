# Auto-Scaling Online Examination Platform

A cloud-ready online examination platform built for bursty exam traffic. The application separates the React frontend from the Express API and PostgreSQL database so each tier can be deployed, secured, and scaled independently on AWS.

## AWS Architecture

The recommended production architecture uses managed AWS services and keeps the API tier stateless:

```text
Students / Admins
        |
 Route 53 (DNS)
        |
 CloudFront (CDN) -------- S3 (React/Vite static files)
        |
        +---- HTTPS ---- Application Load Balancer (public subnets)
                              |
                         Target Group
                              |
                 ECS Fargate or EC2 Auto Scaling Group
                 (private application subnets, Express API)
                              |
                         Amazon RDS
                    PostgreSQL (private DB subnets)
```

### AWS services and responsibilities

| AWS service | Role in this project |
|---|---|
| **Amazon VPC** | Isolates the application into public, private application, and private database subnets across at least two Availability Zones. |
| **Application Load Balancer (ALB)** | Terminates HTTPS, distributes `/api/*` traffic across healthy API instances, and exposes a stable API endpoint to the frontend. |
| **EC2 Auto Scaling Group (ASG)** | Alternative compute layer when the API is deployed directly to EC2. The ASG replaces unhealthy instances and scales the API fleet using CloudWatch metrics. |
| **Amazon RDS for PostgreSQL** | Managed relational database for Prisma. Deploy it in private subnets with Multi-AZ enabled for production workloads. |
| **Amazon CloudWatch** | Collects ALB,EC2, and application logs and drives scaling alarms and operational dashboards. |

> **Deployment status:** this repository contains the application and AWS deployment guidance; it does not provision AWS infrastructure automatically. Create the AWS resources described below with AWS CDK, Terraform, CloudFormation, or the AWS Console before deploying.

### Request flow

1. A user requests the React application through normal Http request at the ALB.
2. Frontend API requests are sent over HTTPS to the ALB.
3. The ALB health-checks and routes requests to API tasks/instances in private application subnets.
4. The Express API uses Prisma to connect to PostgreSQL in private RDS subnets.
5. CloudWatch metrics and logs provide visibility into latency, errors, saturation, and scaling events.

### Network and security design

- Use one VPC spanning at least two Availability Zones.
- Place the ALB in public subnets and the API compute layer in private application subnets.
- Place RDS in private database subnets using a DB subnet group; do not expose the database publicly.
- Allow inbound traffic only from the required security group:
  - Internet -> ALB: `443` (and optionally `80` only to redirect to HTTPS)
  - ALB -> API: `5000` (or the port used by the container)
  - API -> RDS: PostgreSQL `5432`
- Restrict administrative access through AWS Systems Manager Session Manager or a controlled bastion/VPN rather than opening SSH to the internet.
- Store production secrets in Secrets Manager and rotate the database credentials; never commit `backend/.env`.
- Configure CORS and the frontend API URL for the production CloudFront/API domains.

### Scaling strategy

The API is designed to scale horizontally because request state is stored in PostgreSQL and authentication uses JWTs rather than in-memory server sessions.

- **ALB target group:** route only to healthy API tasks/instances using `GET /api/health`.
- **EC2 option:** attach the API instances to an Auto Scaling Group behind the ALB and use a launch template, health checks, and target tracking policies.
- **Database protection:** set sensible maximum capacity and connection limits. Use RDS Proxy or a connection pooler if high task counts could exhaust PostgreSQL connections.
- **Exam-day capacity:** pre-scale before a scheduled exam window when the expected load is known, then let target tracking scale back down afterward.

This scaling model improves API availability during concurrent exam starts and answer submissions; it does not make a single database writer infinitely scalable. RDS sizing, indexes, backups, and connection management remain important capacity controls.

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
- **Database**: PostgreSQL (Amazon RDS or another managed PostgreSQL provider) via `DATABASE_URL`
- **Authentication**: JWT-based with role (STUDENT/ADMIN) enforcement
- **AWS deployment** EC 2, Ngeinx frontend, ALB + EC2 Auto Scaling for the API, and Amazon RDS for PostgreSQL

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

> **Note**: The screenshot sections above are placeholders for the application and AWS infrastructure screenshots.

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

### AWS deployment (recommended)

#### 1. Provision the AWS foundation

Create the VPC, subnets, route tables, security groups, ALB target group, RDS PostgreSQL instance, CloudFront distribution, S3 bucket, ACM certificates, IAM roles, and CloudWatch log groups described in [AWS Architecture](#aws-architecture). Use infrastructure as code for repeatable environments.

#### 2. Configure Amazon RDS

Create the database in private subnets and allow PostgreSQL traffic only from the API security group. Store the resulting connection string as `DATABASE_URL` in Secrets Manager. Apply Prisma migrations from a controlled deployment environment:

```bash
cd backend
npm ci
npx prisma generate
npx prisma migrate deploy
```

#### 3. Deploy the API

Build an API image or package the Node.js service for the selected compute option:

- **ECS Fargate:** push the backend image to Amazon ECR, create an ECS task definition, inject Secrets Manager values, attach the task to the ALB target group, and enable ECS Service Auto Scaling.
- **EC2 Auto Scaling:** create an AMI or launch-template user data script that runs `npm ci`, `npx prisma generate`, and `npm start`; attach instances to the ALB target group and configure ASG target tracking.

The ALB health check should call `GET /api/health`. Keep the API listening on the port configured by `PORT` and bind it to `0.0.0.0` in the compute environment.

#### 4. Deploy the frontend

Set `VITE_API_BASE_URL` to the HTTPS API hostname exposed by the ALB, then build and publish the static files:

```bash
cd frontend
npm ci
npm run build
aws s3 sync dist/ s3://YOUR-FRONTEND-BUCKET/ --delete
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

Configure CloudFront to use S3 with Origin Access Control so the bucket does not need public access.

#### 5. Operate and scale the platform

- Use CloudWatch dashboards and alarms for ALB 5xx responses, target response time, healthy host count, ECS/EC2 CPU and memory, RDS CPU/storage/connections, and application errors.
- Set minimum capacity high enough for the start of an exam and maximum capacity based on tested database limits.
- Enable RDS automated backups, encryption at rest, Multi-AZ, and deletion protection for production.
- Use a CI/CD pipeline, such as GitHub Actions with OIDC, to test, publish the API image, run migrations, deploy the service, and publish the frontend.

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

For AWS, inject these values through ECS task secrets, EC2 instance configuration, or a process manager that reads from AWS Secrets Manager. Do not commit real credentials or JWT secrets.

### Frontend `.env`
```
VITE_API_BASE_URL=http://localhost:5000
VITE_ENABLE_MONITORING=true
```

## License

This project is licensed under the MIT License.