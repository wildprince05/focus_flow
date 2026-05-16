# FocusFlow – Minimalist Pomodoro Productivity App

A modern MERN stack Pomodoro app for deep focus, streak tracking, task management, and gamified productivity.

## Tech Stack

| Layer | Stack |
|-------|--------|
| Frontend | React 19, Vite, Tailwind CSS, Framer Motion, Recharts |
| Backend | Node.js, Express (MVC) |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT (access + refresh, httpOnly cookies) |

## Project Structure

```
focusflow/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # UI components
│       ├── context/        # Auth, Theme, Timer state
│       ├── hooks/          # Pomodoro timer, ambient sound
│       ├── layouts/        # App shell + navigation
│       ├── pages/          # Route pages
│       ├── services/       # API client (axios)
│       └── utils/          # Helpers
├── server/                 # Express API
│   ├── config/             # DB, env validation
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/            # test-db.js
│   ├── services/
│   └── utils/
├── package.json            # Run both apps
└── README.md
```

## Getting Started

### 1. Configure environment

Copy and edit `server/.env`:

```env
MONGODB_USER=focus_flow_db
MONGODB_PASSWORD=your_atlas_password
MONGODB_CLUSTER=cluster0.exjtgep.mongodb.net
MONGODB_DB=focusflow
```

In **MongoDB Atlas**:
- **Database Access** → create user `focus_flow_db` with a password
- **Network Access** → add your IP (or `0.0.0.0/0` for development)

Test the connection:

```bash
cd server
npm run test:db
```

You should see: `MongoDB connected [Atlas (direct)]`

### 2. Install dependencies

```bash
npm install
cd server && npm install
cd ../client && npm install
```

### 3. Run the app

From the project root:

```bash
npm run dev
```

| App | URL |
|-----|-----|
| Frontend | http://localhost:5173 |
| API | http://localhost:5000 |
| Health | http://localhost:5000/api/health |

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user |
| POST | `/api/sessions/complete` | Save Pomodoro session |
| GET | `/api/analytics/dashboard` | Dashboard stats |
| GET/POST/PUT/DELETE | `/api/tasks` | Tasks + reorder |
| GET | `/api/streaks` | Streak data |
| GET | `/api/achievements` | Badges |

## Features

- Pomodoro timer (25/5/15, auto transitions, notifications)
- JWT auth with protected routes
- Tasks with drag-and-drop and priorities
- Streaks + freeze every 7 active days
- XP, levels, achievements
- Dashboard charts + activity heatmap
- Dark/light mode, focus mode, ambient sounds
- Session journal + daily reflection

## License

MIT
