# Developer Portfolio Evaluator

Full-stack GitHub profile analysis app built from the PRD in this repository. It evaluates any public GitHub username, scores the profile across five categories, renders a dashboard-style report, supports side-by-side comparison, and caches reports for 24 hours.

## Stack

- Frontend: React 18, Vite, React Router, Chart.js
- Backend: Node.js, Express, native GitHub REST requests, optional MongoDB with Mongoose
- Caching: MongoDB TTL index when `MONGODB_URI` is configured, otherwise in-memory cache for local development

## Features

- Search any public GitHub username
- Scored report with:
  - Activity
  - Code quality
  - Diversity
  - Community impact
  - Hiring readiness
- Overall score ring and category breakdown
- Radar chart
- Language distribution chart
- Recent activity heatmap
- Top repository cards
- Shareable `/report/:username` route
- Compare mode at `/compare?u1=<username>&u2=<username>`
- `GET /api/profile/:username/cached` for fresh cached results

## Environment Variables

### Server

Copy [server/.env.example](C:\Users\MASUDI SAI HARSHA\Desktop\MSH PROJECT\github_profile_analyser\server\.env.example) to `server/.env`.

```env
PORT=5000
CLIENT_URL=http://localhost:5173
GITHUB_TOKEN=
MONGODB_URI=
JWT_SECRET=replace-me
```

`GITHUB_TOKEN` is optional, but strongly recommended to avoid low unauthenticated GitHub API rate limits. Create a GitHub personal access token, paste it into `server/.env`, and no special scopes are required for public profile/repository reads.

### Client

Copy [client/.env.example](C:\Users\MASUDI SAI HARSHA\Desktop\MSH PROJECT\github_profile_analyser\client\.env.example) to `client/.env`.

```env
VITE_API_URL=http://localhost:5000/api
```

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start both apps:

```bash
npm run dev
```

3. Open the frontend at [http://localhost:5173](http://localhost:5173).

## API

- `GET /api/profile/:username`
- `GET /api/profile/:username/cached`
- `GET /api/compare?u1=:u1&u2=:u2`
- `GET /api/health`

## Deployment

### Frontend on Vercel

- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_URL`

### Backend on Render

- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables:
  - `PORT`
  - `CLIENT_URL`
  - `GITHUB_TOKEN`
  - `MONGODB_URI`

## Notes

- GitHub's REST API does not expose the exact contribution graph from profile pages, so the heatmap is based on recent public events.
- `JWT_SECRET` is included because the PRD lists it, but authentication is not implemented in this version.
- Dynamic OpenGraph tags are not fully server-rendered in this SPA setup.
