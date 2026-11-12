# EDUVANTA - Web Deployment Guide (Vercel & Next.js)

This document provides deployment instructions for the public marketing site, campus web portals, and Super Admin dashboard.

---

## 1. Vercel Deployment for Next.js

EDUVANTA's Next.js applications (`apps/web` and `apps/admin`) are configured for zero-configuration deployment on Vercel or any containerized Node.js cluster.

### Deploying the Web Portals (`apps/web`):
1. In Vercel, import the GitHub repository.
2. Select Root Directory: `apps/web`.
3. Framework Preset: **Next.js**.
4. Configure Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (Server runtime only)
   - `BKASH_APP_KEY`, `BKASH_APP_SECRET`, `BKASH_USERNAME`, `BKASH_PASSWORD`
   - `NAGAD_MERCHANT_ID`, `SSLCOMMERZ_STORE_ID`
5. Click **Deploy**.

### Deploying the Super Admin Console (`apps/admin`):
1. Create a second Vercel project linked to the same repository.
2. Select Root Directory: `apps/admin`.
3. Configure custom subdomain, e.g. `admin.eduvanta.com`.
4. Add environment variables.
5. Click **Deploy**.

---

## 2. Production Build Commands

To build both web applications locally or in CI/CD:
```bash
# Build web portal
npm run build --workspace=@eduvanta/web

# Build admin portal
npm run build --workspace=@eduvanta/admin
```

---

## 3. White-Label Custom Domains Configuration

For institutions with their own custom domains (e.g. `portal.dhakapremier.edu.bd`):
1. Super Admin registers domain under `public.school_domains`.
2. School IT admin configures a CNAME record pointing to `cname.vercel-dns.com` or custom edge proxy.
3. Next.js middleware inspects `request.headers.get('host')` and resolves the tenant's `school_id` accordingly.
