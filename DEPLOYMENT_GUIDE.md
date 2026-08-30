# 🚀 Nivo Production Deployment Guide & Manual Action Items

This document provides the complete, step-by-step production deployment guide and manual action checklist for launching **Nivo** (Frontend Web App & Backend REST API).

---

## 🏗️ Nivo Deployment Architecture

```
 ┌───────────────────────────┐         ┌───────────────────────────┐         ┌───────────────────────────┐
 │   Nivo Web Application    │  HTTPS  │      Nivo REST API        │  Mongoose │    MongoDB Atlas Database  │
 │ (Cloudflare Pages/Vercel) ├────────►│     (Render / Railway)    ├────────►│     (Shared M0 Cluster)   │
 │   https://nivo.app        │         │   https://api.nivo.app    │         │      512 MB Storage       │
 └───────────────────────────┘         └───────────────────────────┘         └───────────────────────────┘
```

---

## 🖐️ Step-by-Step Manual Action Checklist

Follow these 4 phases to launch Nivo into production:

### 1️⃣ Phase 1: Push Local Code to GitHub (5 Minutes)

Run the following commands in your shell to push all repository code and CI/CD pipelines to GitHub:

```bash
git add .
git commit -m "feat: complete Nivo production deployment configuration & CI/CD pipeline"
git push origin main
```

> **What happens automatically**:
> GitHub Actions (`.github/workflows/deploy.yml`) will execute:
> - Code Linting (`oxlint`)
> - TypeScript Type Checking (`tsc --noEmit`)
> - Vitest Unit/Component Suite (17 tests)
> - Playwright E2E Browser Suite (10 tests)
> - Production Bundle Build (`vite build`)

---

### 2️⃣ Phase 2: Create Free MongoDB Atlas Database (5 Minutes)

1. Sign up / log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (100% Free).
2. Click **Create Cluster** $\rightarrow$ Select **M0 Free Cluster**.
3. Under **Database Access**, create a database user (e.g. username: `nivo_admin`) with a strong password.
4. Under **Network Access**, click **Add IP Address** $\rightarrow$ Select **Allow Access from Anywhere (`0.0.0.0/0`)**.
5. Click **Connect** $\rightarrow$ Select **Drivers** $\rightarrow$ Copy your connection string:
   ```env
   mongodb+srv://nivo_admin:<YOUR_PASSWORD>@cluster0.mongodb.net/nivo?retryWrites=true&w=majority
   ```

---

### 3️⃣ Phase 3: Deploy Backend REST API (`event-manager-api`) (10 Minutes)

1. Log in to [Render.com](https://render.com) (or Railway.app) and click **New +** $\rightarrow$ **Web Service**.
2. Connect your `event-manager-api` GitHub repository.
3. Configure service parameters:
   - **Name**: `nivo-api`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. In the **Environment Variables** section, add the following key-value pairs:

| Variable Key | Value | Notes |
| :--- | :--- | :--- |
| `PORT` | `5000` | Server listening port |
| `NODE_ENV` | `production` | Enables production Express optimizations |
| `MONGODB_URI` | *(Your connection string from Phase 2)* | MongoDB Atlas URI |
| `JWT_SECRET` | `nivo-prod-super-secret-jwt-key-2026` | Secret key for signing auth tokens |
| `CLIENT_URL` | `https://nivo.app` | Production frontend domain for CORS |

5. Click **Create Web Service**. Render will deploy your API and issue your live URL (e.g., `https://nivo-api.onrender.com`).

---

### 4️⃣ Phase 4: Deploy Frontend Web Application (`event-manager-app`) (5 Minutes)

#### Option A: Cloudflare Pages (Recommended - 100% Free)
1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com) $\rightarrow$ **Workers & Pages** $\rightarrow$ **Create Application** $\rightarrow$ **Pages**.
2. Connect your `event-manager-app` GitHub repository.
3. Select Framework Preset: **Vite**.
4. Set Build Command: `npm run build`
5. Set Output Directory: `dist`
6. Under **Environment Variables**, add:
   - `VITE_API_URL` = `https://nivo-api.onrender.com/api/v1`
7. Click **Save and Deploy**.

#### Option B: Vercel
1. Log in to [Vercel.com](https://vercel.com) $\rightarrow$ **Add New Project**.
2. Import your `event-manager-app` repository.
3. Add Environment Variable:
   - `VITE_API_URL` = `https://nivo-api.onrender.com/api/v1`
4. Click **Deploy**.

---

## 📋 Post-Deployment Smoke Check

Once both services are deployed:

1. Open your live frontend URL (`https://nivo-app.pages.dev` or `https://nivo.app`).
2. Navigate to `/register` and register a new production account.
3. Verify your **Dashboard**, **Calendar**, and **Services** views.
4. Launch the **Event Wizard** (`/events/new`) and create an event.

---

## 🔍 Pre-Flight Verification Audit Log

```
✓ TypeScript Compilation: 0 errors (tsc -b)
✓ Production Build: PASSED (dist/ index.html, JS, CSS)
✓ Vitest Suite: 17/17 PASSED
✓ Playwright E2E Suite: 10/10 PASSED
✓ SPA Route Redirects: public/_redirects & vercel.json configured
✓ CI/CD Pipeline: .github/workflows/deploy.yml ready
```
