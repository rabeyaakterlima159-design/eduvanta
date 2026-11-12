# EDUVANTA - Environment & Developer Machine Setup Guide

This guide describes how to prepare a developer environment to build, test, and deploy all services in the EDUVANTA monorepo.

---

## 1. System Requirements & Toolchain

| Tool | Recommended Version | Purpose |
|---|---|---|
| **Node.js** | v20+ or v24+ | Monorepo npm workspaces, Next.js web & admin portals |
| **npm** | v10+ | Package management & script execution |
| **Flutter SDK** | v3.22+ or v3.38+ | Cross-platform mobile development (Android & iOS) |
| **Dart SDK** | v3.3+ | Language runtime for mobile |
| **JDK (Java)** | OpenJDK 17 or 21 (or Android Studio JBR) | Android Gradle builds |
| **Android SDK** | API Level 34 / 36 | Android compilation |
| **Supabase CLI** | v1.140+ | Local database migrations and Edge Function deployments |

---

## 2. Monorepo Installation

Clone the repository and install all workspace packages:
```bash
git clone <repo-url> eduvanta
cd eduvanta
npm install
```

---

## 3. Environment Variables

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Populate keys:
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase Anonymous Public Key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase Service Role Secret Key (Server-side / Edge Functions only)
- Payment sandbox credentials for bKash, Nagad, and SSLCommerz.

---

## 4. Running the Portals Locally

1. **Next.js Public Marketing & Campus Portals**:
   ```bash
   npm run web:dev
   ```
   Open `http://localhost:3000`

2. **Super Admin Platform Control Center**:
   ```bash
   npm run admin:dev
   ```
   Open `http://localhost:3001`

3. **Flutter Mobile Application**:
   ```bash
   cd apps/mobile
   flutter pub get
   flutter run
   ```
