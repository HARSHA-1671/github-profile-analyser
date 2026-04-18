# Deployment Guide

Follow these steps to deploy the GitHub Profile Analyzer to production.

## 1. Backend (Render / Heroku)

### Prerequisites
- A MongoDB Atlas account (already set up).
- A GitHub Personal Access Token.

### Steps
1. Create a new **Web Service** on Render.
2. Connect your repository.
3. Configure the following **Environment Variables**:
   - `GITHUB_TOKEN`: Your GitHub token.
   - `MONGODB_URI`: Your Atlas connection string.
   - `CLIENT_URL`: The URL of your deployed frontend (e.g., `https://your-app.vercel.app`).
   - `PORT`: 5000 (Render will override this, but good to have).
4. **Build Command**: `npm install` (run in the `server` directory).
5. **Start Command**: `npm start`.

## 2. Frontend (Vercel / Netlify)

### Steps
1. Create a new **Project** on Vercel.
2. Connect your repository.
3. Set the **Root Directory** to `client`.
4. Configure the following **Environment Variables**:
   - `VITE_API_URL`: Your deployed backend URL (e.g., `https://your-api.onrender.com`).
5. **Build Command**: `npm run build`.
6. **Output Directory**: `dist`.

## 3. Post-Deployment
- Once the frontend is live, make sure to update the `CLIENT_URL` in the Backend settings with the actual Vercel URL to allow CORS.

---
**Note**: Since the project uses separate directories for client and server, you will need to create two separate deployments pointing to the same repository but different root folders.
