# Product Requirements Document
## Developer Portfolio Evaluator

### 1. Overview
The Developer Portfolio Evaluator is a full-stack web application that analyzes a public GitHub profile and generates a detailed developer scorecard. The application uses freely available GitHub REST API data to evaluate activity, code quality, project diversity, community impact, and hiring readiness.

### 2. Problem Statement
Recruiters and developers need a fast way to assess the strength of a GitHub profile using objective signals. Manual profile review is time-consuming and inconsistent. This product provides a standardized, visual evaluation of a developer’s public GitHub presence.

### 3. Goals
- Let users search any valid GitHub username.
- Fetch profile and repository data from GitHub.
- Compute five category scores and an overall score.
- Display a polished visual report with charts and top repositories.
- Support deployment on Vercel and Render.

### 4. Non-Goals
- No paid AI model usage.
- No private GitHub data access.
- No enterprise authentication system in the first version.
- No mobile app.
- No advanced team collaboration features.

### 5. Database Choice
- **MongoDB**: Chosen for its flexible schema (ideal for semi-structured GitHub JSON data) and high performance.
- **Mongoose**: Utilized as the ODM (Object Data Modeling) library for Node.js to manage data relationships and schema validation.

### 6. Primary Users
- Students building their developer portfolio.
- Recruiters screening GitHub profiles.
- Developers comparing their own profiles.
- Interns or reviewers evaluating project quality.

### 6. Core User Flows
#### 6.1 Search and Evaluate
1. User enters a GitHub username.
2. System fetches GitHub profile data.
3. System fetches repo and activity data.
4. Scoring engine computes category scores.
5. UI renders scorecard, charts, and top repositories.

#### 6.2 Compare Two Profiles
1. User enters two usernames.
2. System generates both reports.
3. UI displays side-by-side score comparison.
4. Category winners are highlighted.

### 7. Functional Requirements
#### 7.1 GitHub Username Search
- Accept any public GitHub username.
- Fetch user profile data.
- Show avatar, bio, join date, followers, and public repo count.
- Show an error message for invalid or unavailable usernames.

#### 7.2 Scoring Engine
The system must calculate:
- Activity score.
- Code quality score.
- Diversity score.
- Community impact score.
- Hiring readiness score.
- Overall weighted score out of 100.

#### 7.3 Visual Report
The report must include:
- Overall score ring.
- Radar chart for all five categories.
- Contribution heatmap.
- Language distribution bar chart.
- Top 6 repositories with metadata.

### 8. Non-Functional Requirements
- Response time should be fast.
- Errors must be handled gracefully.
- Code should be modular and maintainable.
- Secrets must remain in environment variables only.
- The system should be deployable on free tiers.
- GitHub API usage should respect rate limits.

### 9. UI Requirements
The frontend should use:
- React 18 + Vite.
- React Router v6.
- Chart.js for charts.
- A clean dashboard-style layout.

Required components:
- Search bar.
- Score card.
- Radar chart.
- Heatmap.
- Repo list.
- Report component.

Required pages:
- Home page/Dashboard.
- Compare page.

### 10. System Architecture
#### 10.1 Frontend
- React Vite app.
- Axios for API calls.
- Routing handled by React Router.

#### 10.2 Backend
- Node.js + Express REST API.
- GitHub API access through @octokit/rest.
- Scoring logic isolated in a dedicated service.
- In-memory caching for performance.

#### 10.3 Suggested Folder Structure
```txt
portfolio-evaluator/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── .env
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   ├── config/
│   ├── app.js
│   └── .env
└── README.md
```

### 11. API Specification
#### GET /api/profile/:username
Returns a full scored report for the requested GitHub username.

#### GET /api/compare?u1=:u1&u2=:u2
Returns two reports for comparison.

#### GET /api/health
Returns service health status.

### 12. Data Requirements
Each report should include:
- Username.
- Avatar URL.
- Name.
- Bio.
- Followers.
- Public repositories.
- Score breakdown.
- Top repositories.
- Language distribution.
- Heatmap data.

### 13. Scoring Logic
#### 13.1 Category Weights
- Activity: 25.
- Code Quality: 20.
- Diversity: 20.
- Community: 20.
- Hiring Ready: 15.

#### 13.2 Signals
- Activity: recent commits, push frequency, streak consistency.
- Code Quality: README, license, topics, tests folder.
- Diversity: number of languages, project variety.
- Community: stars, forks, followers.
- Hiring Ready: bio, website, email, pinned repos.

#### 13.3 Output
- Each category should produce a normalized score.
- Overall score should be a weighted total out of 100.

### 14. Caching Requirements
- **Dual-Layer Caching**: In-memory caching for performance + MongoDB for persistent storage.
- **Persistence**: Store reports in MongoDB to allow for direct shareable links (e.g., `/report/octocat`).
- **Refresh Policy**: Reports can be refreshed every 24 hours to stay current with GitHub activity.

### 15. Environment Variables
#### Server
- `GITHUB_TOKEN`
- `PORT`
- `CLIENT_URL`
- `MONGODB_URI`

#### Client
- `VITE_API_URL`

### 16. Deployment Requirements
- Frontend deployed on Vercel.
- Backend deployed on Render.
- MongoDB Atlas (or equivalent) for database hosting.

### 17. Testing Requirements
- Valid username returns a complete report.
- Invalid username shows a user-friendly error.
- Compare mode loads both reports correctly.
- API failures are handled safely.
- Database correctly stores and retrieves reports.
- Direct URLs load data from MongoDB without re-fetching from API if valid.

### 18. Acceptance Criteria
The project is complete when:
- GitHub username lookup works.
- All five scores are shown.
- Overall score is displayed.
- Top repos are visible.
- Charts render correctly.
- Frontend and backend are connected and functional.

### 19. Milestones
#### Milestone 1
Project setup, environment variables, and backend skeleton.

#### Milestone 2
GitHub API integration using Octokit.

#### Milestone 3
Scoring engine and in-memory caching.

#### Milestone 4
Frontend dashboards, charts, and report views.

#### Milestone 5
Compare mode, testing, and deployment.

### 20. tools and techstack
#### Frontend
- React 18.
- Vite.
- React Router v6.
- Axios.
- Recharts/Chart.js.

#### Backend
- Node.js.
- Express.js.
- MongoDB & Mongoose.
- @octokit/rest.
- node-cron.
- dotenv.

#### Deployment
- Vercel for frontend.
- Render for backend.
- MongoDB Atlas for database.

### 21. Core Project Files
- `githubService.js` for GitHub API calls.
- `scoringService.js` for scoring logic.
- `profileController.js` for request handling.
- `cacheService.js` for in-memory cache.
- `db.js` for MongoDB connection.
- `Report.js` Mongoose model.

### 22. UI Components
- `ScoreCard.jsx`.
- `RadarChart.jsx`.
- `HeatMap.jsx`.
- `RepoList.jsx`.
- `SearchBar.jsx`.
- `ReportPage.jsx` for shared report viewing.