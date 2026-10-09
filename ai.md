# Frontend-to-Backend Implementation Blueprint

This document describes the current frontend, the backend work required to make it
production-backed, the API contract to implement, and the exact frontend files that
must change.

## 1. Current status

### Frontend

The frontend is a React 18 + Vite application using:

- React Router 6 for navigation.
- Tailwind CSS for styling.
- `lucide-react` for icons.
- Recharts for admin analytics.
- Local component state for forms, filters, modals, exam answers, and table updates.
- `frontend/src/data/mockData.js` as the current data source.

The visual UI and most user flows already exist. The frontend is currently a
prototype: a refresh resets changes, authentication accepts any valid-looking
credentials, and exam submission never reaches a server.

### Backend

The backend is an Express application in `backend/src/index.js`. It currently has:

- `cors`, `dotenv`, and JSON/form body parsing.
- `GET /api/health`.
- A generic 404 response.
- A generic error handler.
- No database connection.
- No authentication or authorization.
- No user, exam, question, attempt, result, notification, or analytics routes.

### Development connection

`frontend/vite.config.js` proxies `/api/*` to `http://localhost:5000`. Frontend
requests should therefore use relative URLs such as `/api/auth/login`, not a
hard-coded backend host.

## 2. Existing browser routes

These are React Router routes. They are not backend API routes and should remain
the user-facing URLs.

### Public/auth routes

| Browser route | Current page | Backend integration |
|---|---|---|
| `/login` | `LoginPage` | `POST /api/auth/login` |
| `/register` | `RegisterPage` | `POST /api/auth/register` |
| `/forgot-password` | `ForgotPasswordPage` | `POST /api/auth/forgot-password` |

### Student routes

| Browser route | Current page | Backend integration |
|---|---|---|
| `/student/dashboard` | `StudentDashboard` | dashboard summary endpoint |
| `/student/exams` | `StudentExamsPage` | list published/available exams |
| `/student/exams/:id` | `ExamDetailsPage` | exam details and eligibility |
| `/student/exam/:id` | `LiveExamPage` | start, save answers, submit attempt |
| `/student/results` | `StudentResultsPage` | student results list/detail |
| `/student/history` | `StudentHistoryPage` | attempt history |
| `/student/notifications` | `StudentNotificationsPage` | notifications and read status |
| `/student/profile` | `StudentProfilePage` | current user and profile update |

`/student/exam/:id` is intentionally outside `StudentLayout` so the live exam
can stay distraction-free. It still must be protected by authentication.

### Admin routes

| Browser route | Current page | Backend integration |
|---|---|---|
| `/admin/dashboard` | `AdminDashboard` | admin overview and recent activity |
| `/admin/students` | `AdminStudentsPage` | student list, search, status changes |
| `/admin/exams` | `AdminExamsPage` | exam CRUD and publishing |
| `/admin/exams/create` | `RoutePlaceholder` | create exam form/page |
| `/admin/exams/:id` | `RoutePlaceholder` | exam configuration/details |
| `/admin/questions` | `AdminQuestionsPage` | question CRUD |
| `/admin/question-bank` | `AdminQuestionBankPage` | question bank filters/assignment |
| `/admin/monitoring` | `AdminMonitoringPage` | active attempt monitoring |
| `/admin/results` | `AdminResultsPage` | result search, filters, answer review |
| `/admin/analytics` | `AdminAnalyticsPage` | analytics aggregates |
| `/admin/profile` | `AdminProfilePage` | admin profile/password |

## 3. Files that currently use mock/local data

`frontend/src/data/mockData.js` is the central prototype data source. It contains
mock users, students, exams, questions, results, notifications, analytics, and
admin activities. It should remain temporarily as a fixture for UI fallback/tests,
but production components must stop importing it directly.

### Replace direct mock imports

The following pages currently import mock data and should use API hooks/services:

- `frontend/src/pages/admin/AdminStudentsPage.jsx`
- `frontend/src/pages/admin/AdminExamsPage.jsx`
- `frontend/src/pages/admin/AdminQuestionsPage.jsx`
- `frontend/src/pages/admin/AdminQuestionBankPage.jsx`
- `frontend/src/pages/admin/AdminResultsPage.jsx`
- `frontend/src/pages/admin/AdminDashboard.jsx`
- `frontend/src/pages/admin/AdminProfilePage.jsx`
- `frontend/src/pages/student/StudentDashboard.jsx`
- `frontend/src/pages/student/StudentExamsPage.jsx`
- `frontend/src/pages/student/ExamDetailsPage.jsx`
- `frontend/src/pages/student/LiveExamPage.jsx`
- `frontend/src/pages/student/StudentResultsPage.jsx`
- `frontend/src/pages/student/StudentHistoryPage.jsx`
- `frontend/src/pages/student/StudentNotificationsPage.jsx`

Some pages do not import mock data directly but still need to replace simulated
delays or local-only updates. Search for `setTimeout`, `mock`, and `useState`
initialised from `mockData.js` while wiring each screen.

## 4. Frontend changes to make

### 4.1 Add a single API client

Create `frontend/src/lib/api.js` (or `frontend/src/services/api.js`) with:

- A relative `/api` base URL.
- JSON request/response handling.
- credentials enabled if cookie sessions are used.
- Consistent error parsing.
- Abort signal support for page requests.
- No silent fallback to mock data on failed requests.

Recommended shape:

```js
api.get('/exams')
api.post('/auth/login', payload)
api.patch(`/students/${id}/status`, payload)
```

Display server errors through the existing `ErrorState`/toast components.

### 4.2 Replace `AuthContext`

Replace the simulated login in `frontend/src/contexts/AuthContext.jsx` with:

1. `POST /api/auth/login`.
2. Store only the server-returned user/session state.
3. Call `GET /api/auth/me` on application startup.
4. `POST /api/auth/logout` and clear local state.
5. Expose `isLoading`, `error`, and an auth-ready state.
6. Redirect according to the authenticated role.

Add protected route wrappers in `frontend/src/routes/AppRoutes.jsx`:

- `RequireAuth` for student/admin authenticated pages.
- `RequireRole` for admin-only pages.
- Redirect unauthenticated users to `/login`.
- Redirect authenticated users away from public auth pages when appropriate.

Do not trust a role supplied by a login form. The backend must determine the role.

### 4.3 Add reusable data hooks

Create hooks under `frontend/src/hooks/` or service modules for:

- `useExams`
- `useExam`
- `useQuestions`
- `useStudents`
- `useAttempts`
- `useResults`
- `useNotifications`
- `useAnalytics`

Each hook should own loading/error/refetch behavior and return server data.
Existing table filters, pagination, modals, and forms can remain visually
unchanged while their handlers call these hooks.

### 4.4 Wire the live exam correctly

`frontend/src/pages/student/LiveExamPage.jsx` currently:

- Finds an exam in `mockExams`.
- Builds a question list locally.
- Keeps answers only in React state.
- Submits only by changing the local submitted state.

Replace this with:

1. `POST /api/exams/:examId/attempts` when the page starts.
2. Use the returned attempt ID, server question order, and server end time.
3. Save each answer using a debounced `PUT /api/attempts/:attemptId/answers/:questionId`.
4. Restore an existing in-progress attempt after refresh/reconnect.
5. Submit with `POST /api/attempts/:attemptId/submit`.
6. Submit automatically when the server deadline is reached.
7. Treat the server as authoritative for time, eligibility, and submission status.
8. Navigate to the result/confirmation only after the server confirms submission.

Never send correct answers to the student client. The exam-start response should
contain question text/options but not `correctAnswer`.

### 4.5 Wire admin CRUD

Replace local `setState` mutations with API calls:

- Add/edit/delete question: `POST/PATCH/DELETE /api/questions`.
- Add/edit/delete exam: `POST/PATCH/DELETE /api/exams`.
- Publish/cancel exam: `POST /api/exams/:id/publish` and
  `POST /api/exams/:id/cancel`.
- Enable/disable student: `PATCH /api/students/:id/status`.
- Update profile/password through profile endpoints.

After a successful mutation, refetch or update the relevant cached list from the
server. Do not show a success toast before the request succeeds.

### 4.6 Replace placeholders

Implement these existing placeholder routes after their API endpoints exist:

- `/admin/exams/create`: multi-step exam creation form.
- `/admin/exams/:id`: exam settings, question assignment, eligible sections,
  schedule, publish/cancel actions.

The page should use the existing common components and follow the data shape in
`mockData.js` until the backend contract is finalised.

## 5. Proposed backend API

All endpoints are prefixed with `/api`. JSON responses should use a consistent
shape:

```json
{
  "data": {},
  "error": null,
  "meta": {}
}
```

Errors should use:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "A readable message",
    "fields": {}
  }
}
```

### Health

| Method | Route | Purpose |
|---|---|---|
| GET | `/health` | Liveness/readiness check |

### Authentication

| Method | Route | Purpose |
|---|---|---|
| POST | `/auth/register` | Create a student account |
| POST | `/auth/login` | Authenticate and create session/token |
| POST | `/auth/logout` | Invalidate session/token |
| GET | `/auth/me` | Return current authenticated user |
| POST | `/auth/forgot-password` | Start password reset |
| POST | `/auth/reset-password` | Complete password reset |
| PATCH | `/auth/password` | Change password for logged-in user |

Recommended production approach: short-lived access token plus secure, httpOnly
refresh cookie, or a secure httpOnly session cookie. Never store passwords or
long-lived tokens in plain local storage.

### Student-facing exam routes

| Method | Route | Purpose |
|---|---|---|
| GET | `/student/dashboard` | Counts, upcoming exams, recent results |
| GET | `/exams` | List exams visible to current user; support `status`, `search`, `page`, `limit` |
| GET | `/exams/:id` | Exam details, instructions, eligibility, schedule |
| POST | `/exams/:id/attempts` | Start or resume an attempt |
| GET | `/attempts/:id` | Restore attempt state |
| PUT | `/attempts/:id/answers/:questionId` | Save or replace one answer |
| POST | `/attempts/:id/submit` | Finalise and grade attempt |
| GET | `/student/results` | Current student's results |
| GET | `/student/results/:id` | Result detail and permitted answer review |
| GET | `/student/history` | Attempt history |
| GET | `/student/notifications` | Current user's notifications |
| PATCH | `/student/notifications/:id/read` | Mark one notification read |
| POST | `/student/notifications/read-all` | Mark all notifications read |
| GET | `/profile` | Current profile |
| PATCH | `/profile` | Update allowed profile fields |

### Admin routes

| Method | Route | Purpose |
|---|---|---|
| GET | `/admin/dashboard` | Overview cards, active exams, recent activity |
| GET | `/students` | Paginated student list with search/status filters |
| GET | `/students/:id` | Student details |
| PATCH | `/students/:id/status` | Enable/disable a student |
| GET | `/exams` | Admin exam list with filters |
| POST | `/exams` | Create draft exam |
| GET | `/exams/:id` | Full exam configuration |
| PATCH | `/exams/:id` | Update draft/configuration |
| DELETE | `/exams/:id` | Delete draft or permitted exam |
| POST | `/exams/:id/publish` | Publish exam |
| POST | `/exams/:id/cancel` | Cancel exam |
| GET | `/questions` | Paginated/filterable question bank |
| POST | `/questions` | Create question |
| GET | `/questions/:id` | Get question |
| PATCH | `/questions/:id` | Update question |
| DELETE | `/questions/:id` | Delete question |
| PUT | `/exams/:id/questions` | Assign/order questions for an exam |
| GET | `/admin/monitoring` | Active attempts and candidate status |
| GET | `/admin/results` | All results with search/filter/pagination |
| GET | `/admin/results/:id` | Result and answer breakdown |
| GET | `/admin/analytics` | Aggregated performance and exam metrics |
| GET | `/admin/profile` | Admin profile |
| PATCH | `/admin/profile` | Update admin profile |

Use role middleware so `/admin/*` data cannot be accessed by students.

## 6. Suggested backend structure

Refactor the current single-file backend into:

```text
backend/src/
├── index.js
├── app.js
├── config/
│   ├── env.js
│   └── database.js
├── middleware/
│   ├── auth.js
│   ├── roles.js
│   ├── validate.js
│   ├── notFound.js
│   └── errorHandler.js
├── routes/
│   ├── health.js
│   ├── auth.js
│   ├── profile.js
│   ├── student.js
│   ├── exams.js
│   ├── attempts.js
│   ├── questions.js
│   ├── students.js
│   ├── results.js
│   ├── notifications.js
│   └── analytics.js
├── controllers/
├── services/
├── repositories/
├── validators/
└── db/
    ├── migrations/
    └── seed.js
```

Keep route handlers thin. Validation belongs at the request boundary, business
rules in services, and database access in repositories.

## 7. Minimum database model

Use a relational database for the first implementation (PostgreSQL is the
recommended production choice).

### Tables

- `users`: id, institutional_id, name, email, password_hash, role, status,
  branch, semester, section, phone, avatar_url, created_at, updated_at.
- `exams`: id, title, subject, code, duration_minutes, total_marks, pass_mark,
  negative_marking, negative_marks, start_time, end_time, status, created_by,
  instructions, created_at, updated_at.
- `questions`: id, subject, topic, category, difficulty, text, options,
  correct_answer, marks, created_by, created_at, updated_at.
- `exam_questions`: exam_id, question_id, position, marks.
- `exam_assignments`: exam_id, student_id or section criteria, assigned_at.
- `attempts`: id, exam_id, student_id, status, started_at, expires_at,
  submitted_at, time_taken_seconds, score, percentage, grade.
- `attempt_answers`: attempt_id, question_id, selected_option, is_correct,
  marks_awarded, answered_at.
- `notifications`: id, user_id, title, message, type, link, read_at, created_at.
- `audit_logs`: actor_id, action, entity_type, entity_id, metadata, created_at.
- `refresh_tokens` or server-side `sessions`: user/session identity and expiry.

Store question options as JSON/JSONB or in a separate `question_options` table.
The important rule is that `correct_answer` must never be included in a student
exam payload.

## 8. Business rules that must be server-side

1. Only active users may log in or start an attempt.
2. Only eligible students may see/start an exam.
3. A published exam cannot be edited in ways that change an active attempt.
4. An exam can be started only inside its configured availability window, with
   any explicitly approved grace period.
5. One student must not create multiple active attempts for the same exam.
6. The server calculates `expires_at`; the browser timer is only a display aid.
7. Submission is idempotent. Repeated submit requests return the same final result.
8. Scoring, negative marking, pass/fail, and grade calculation run on the server.
9. Correct answers remain private from students.
10. Admin actions are authorized and recorded in `audit_logs`.
11. Pagination, search, sort, and filters must be applied in the database.
12. All timestamps are stored in UTC and formatted in the frontend's locale.

## 9. Recommended implementation order

### Phase 1: Backend foundation

1. Add environment validation and database connection.
2. Add migrations and seed data based on `mockData.js`.
3. Add validation, auth, role middleware, consistent errors, and request logging.
4. Keep `GET /api/health` working and add database readiness information.

### Phase 2: Authentication and profiles

1. Implement register/login/logout/me/password routes.
2. Replace `AuthContext` and add protected/role-based routes.
3. Wire profile pages.

### Phase 3: Read-only student experience

1. Implement exam list/details and dashboard endpoints.
2. Add API client and data hooks.
3. Replace student page mock imports.
4. Wire notifications, history, and results reads.

### Phase 4: Exam execution

1. Implement attempt creation/resume.
2. Implement answer autosave and reconnect recovery.
3. Implement server-side timer/submit/scoring.
4. Update `LiveExamPage` and test refresh, duplicate submit, expiry, and network loss.

### Phase 5: Admin management

1. Implement questions and question-bank CRUD.
2. Implement exam creation/configuration/publish/cancel.
3. Replace admin local state mutations.
4. Implement student status management.

### Phase 6: Monitoring, analytics, and hardening

1. Implement monitoring and admin result review.
2. Implement analytics aggregates.
3. Add audit logs, rate limits, security headers, input limits, and tests.
4. Remove production reliance on `mockData.js`.

## 10. Testing checklist

### Frontend

- Login, logout, session restoration, and role redirects.
- Loading, empty, validation, 401, 403, 404, and 500 states.
- Search/filter/pagination after server refetch.
- Exam start/resume after refresh.
- Answer autosave and recovery after a failed request.
- Timer expiry and duplicate submission.
- Admin create/edit/delete/publish flows.
- No correct answer present in browser network responses.

### Backend

- Unit tests for validation, authorization, scoring, grade calculation, and
  availability windows.
- Integration tests for every route and role.
- Transaction test for final submission.
- Idempotency test for repeated submit requests.
- Database migration and seed test.
- Load test for many concurrent exam starts and answer saves, since autoscaling
  is a core project requirement.

## 11. Definition of done

The frontend/backend integration is complete when:

- No production page depends on `mockData.js`.
- Authenticated and role-protected routes work after a browser refresh.
- All displayed lists and dashboard values come from the API.
- An exam attempt survives refresh/reconnect and is graded exactly once.
- The server, not the client, enforces permissions, timing, and scoring.
- Admin mutations persist in the database and are reflected after reload.
- API errors are visible to the user and never silently converted into fake
  success.
- Backend and frontend builds/tests pass.

