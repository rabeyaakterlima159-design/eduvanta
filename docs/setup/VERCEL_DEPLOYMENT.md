# EDUVANTA — Vercel Deployment Guide

This guide explains how to deploy the **EDUVANTA Next.js Web Platform** (Web Portal, Student Portal, Admissions, and Super Admin Dashboard) directly to **Vercel** with automatic continuous deployment from GitHub.

---

## 1. Quick Overview

- **GitHub Repository**: `https://github.com/rabeyaakterlima159-design/eduvanta`
- **Branch**: `main`
- **Framework Preset**: `Next.js`
- **Monorepo Root Directory**: `apps/web`

---

## 2. Step-by-Step Vercel Deployment via Browser (Recommended)

### Step 1: Open Vercel
1. Go to [https://vercel.com](https://vercel.com) in your browser.
2. Sign in with your GitHub account: **`rabeyaakterlima159-design`**.

### Step 2: Import Repository
1. On your Vercel Dashboard, click **Add New...** -> **Project**.
2. Find the **`eduvanta`** repository in your list and click **Import**.

### Step 3: Configure Project Settings (Crucial for Monorepo)
In the **Configure Project** screen:

1. **Project Name**: `eduvanta` (or any name you prefer).
2. **Framework Preset**: Select **Next.js** (automatically detected).
3. **Root Directory**:
   - Click the **Edit** button next to Root Directory.
   - Select **`apps/web`** from the dropdown/selector.
   - Click **Continue**.
4. **Build and Output Settings**:
   - Leave as default (Build Command: `next build`, Output Directory: `.next`).

### Step 4: Add Environment Variables
Under the **Environment Variables** section, add the following variables:

| Key | Value | Description |
|---|---|---|
| `NEXT_PUBLIC_APP_NAME` | `EDUVANTA` | Platform Branding |
| `NEXT_PUBLIC_APP_TAGLINE` | `One Platform. Every Campus. Smarter Education.` | Platform Tagline |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://eduvanta-demo.supabase.co` | Supabase Project URL (or your live Supabase URL) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.dummy_anon_key_for_build` | Supabase Anon Key (or your live Anon Key) |
| `NEXT_PUBLIC_API_URL` | `/api` | API Base Route |

### Step 5: Click Deploy
1. Click the blue **Deploy** button.
2. Vercel will install dependencies, compile Next.js, and output a live `.vercel.app` URL (e.g., `https://eduvanta.vercel.app`).
3. You can now access your live website and Super Admin dashboard from anywhere in the world!

---

## 3. Alternative: Deploy via Vercel CLI

If you prefer terminal deployment:
1. Run `npx vercel login` in your terminal and authorize via your browser.
2. In the project directory, run:
   ```bash
   cd apps/web
   npx vercel
   ```
3. Follow the CLI prompts to deploy.

---

## 4. Live Super Admin Access
Once deployed on Vercel:
- **URL**: `https://<your-project-name>.vercel.app/login`
- **Select Role**: `Super Admin`
- **Email**: `rabeyaakterlima159@gmail.com`
- **Password**: `Australia515#`
- **Dashboard**: `https://<your-project-name>.vercel.app/super-admin`
