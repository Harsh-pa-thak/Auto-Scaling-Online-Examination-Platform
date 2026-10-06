# Auto-Scaling Online Examination Platform

A full-stack web application with a **React + Vite** frontend and a **Node.js + Express** backend.

## Project Structure

```
.
├── frontend/          # React + Vite app (port 5173)
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/           # Express REST API (port 5000)
│   ├── src/
│   │   ├── routes/
│   │   │   └── health.js
│   │   └── index.js
│   ├── .env
│   └── package.json
│
└── .gitignore
```

## Getting Started

### Backend

```bash
cd backend
npm install
npm run dev        # starts with --watch (Node 18+)
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

| Method | Path         | Description          |
|--------|--------------|----------------------|
| GET    | `/api/health` | Server health check |
