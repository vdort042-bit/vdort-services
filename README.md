# VDORT Services Pvt. Ltd.

**Value-Driven Opportunities, Recruitment & Talent**

Premium international staffing and AI-powered recruitment platform.

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Framer Motion, React Router
- **Backend:** Node.js, Express.js
- **Database:** In-memory store (ready for MongoDB Atlas / Firebase)

## Quick Start

```bash
# Install all dependencies
npm run install:all

# Run frontend + backend together
npm run dev
```

- **Website:** http://localhost:5173
- **API:** http://localhost:5000/api/health

## Portals

| Portal | URL | Credentials |
|--------|-----|-------------|
| Public Website | http://localhost:5173 | — |
| Admin Dashboard | http://localhost:5173/admin/login | admin@vdort.com / admin123 |
| Client Portal | http://localhost:5173/client/login | client@vdort.com / client123 |

## Project Structure

```
vdort/
├── client/          # React frontend (public site + admin + client portals)
├── server/          # Express API backend
└── package.json     # Root scripts
```

## API Endpoints

- `GET /api/health` — Health check
- `POST /api/auth/login` — Login (admin/client)
- `GET /api/jobs` — Public job listings
- `POST /api/applications` — Submit job application
- `POST /api/contacts` — Contact form submission
- `POST /api/subscribers` — Newsletter subscribe
- `GET /api/testimonials` — Testimonials
- `GET /api/analytics/overview` — Admin dashboard stats

## Deployment

- **Frontend:** Vercel (`client/` directory)
- **Backend:** Render (`server/` directory)

Set environment variables:
- Client: `VITE_API_URL=https://your-api.onrender.com/api`
- Server: `JWT_SECRET`, `CLIENT_URL`, `MONGODB_URI` (when ready)

## Adding Database

The backend uses an in-memory store (`server/src/store/`). To connect MongoDB Atlas or Firebase, replace the store layer with your database adapter — all routes are structured for easy migration.
