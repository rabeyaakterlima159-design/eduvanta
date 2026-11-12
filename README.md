# EDUVANTA — Smart Campus Management Ecosystem

> **"One Platform. Every Campus. Smarter Education."**  
> *SMARTER CAMPUS • BRIGHTER FUTURE*

---

## 1. Executive Summary

**EDUVANTA** is an enterprise-grade, multi-tenant B2B2C educational SaaS platform designed to unite institutional leadership, faculty, students, and parents under a synchronized, modern technological infrastructure. 

Built with **Flutter (Android/iOS)**, **Next.js (Web Portals & Super Admin Dashboard)**, and **Supabase (PostgreSQL with strict Row Level Security, Edge Functions & Storage)**, EDUVANTA features a proprietary **Server-Driven UI (SDUI)** engine that empowers platform and campus administrators to update branding, themes, widget layouts, and navigation without requiring new application store releases.

---

## 2. System Architecture & Technology Stack

```
                          +------------------------------------+
                          |           EDUVANTA SAAS            |
                          |    Centralized Cloud Platform      |
                          +------------------------------------+
                                             |
             +-------------------------------+-------------------------------+
             |                                                               |
+----------------------------+                                 +----------------------------+
|    Next.js Web Frontend    |                                 |   Flutter Android & iOS    |
| - Public Marketing Site    |                                 | - Server-Driven UI (SDUI)  |
| - Super Admin Dashboard    |                                 | - Student Academic Portal  |
| - School Leadership Hub    |                                 | - Teacher Grading Portal   |
| - Teacher & Faculty Portal |                                 | - Parent Multi-Child View  |
| - Student & Parent Portals |                                 | - Push Notifications (FCM) |
+----------------------------+                                 +----------------------------+
             |                                                               |
             +-------------------------------+-------------------------------+
                                             |
                                             v
                             +-------------------------------+
                             |    SUPABASE UNIFIED BACKEND   |
                             | - PostgreSQL with Strict RLS  |
                             | - Cryptographic JWT & RBAC    |
                             | - Supabase Storage Buckets    |
                             | - Deno Edge Functions         |
                             +-------------------------------+
                                             |
                        +--------------------+--------------------+
                        |                                         |
           +--------------------------+              +--------------------------+
           |  Firebase Cloud Messaging|              | Bangladesh Gateways      |
           | - Android & Web FCM      |              | - bKash Checkout (URL)   |
           | - Topic & User Targeting |              | - Nagad Merchant API     |
           | - Attendance Alerts      |              | - SSLCommerz IPN         |
           +--------------------------+              +--------------------------+
```

### Core Technologies:
- **Mobile Application**: Flutter 3.38+, Dart 3.13+, Material Design 3, Riverpod, GoRouter, Supabase Flutter SDK, Flutter Secure Storage, Dio.
- **Web Applications**: Next.js 14 App Router, TypeScript, React 18, Tailwind CSS, Shadcn/Radix UI patterns, React Hook Form, Zod, Recharts.
- **Database & Backend**: PostgreSQL 15+ (Supabase Managed), Row Level Security (RLS), Supabase Auth, Supabase Storage, Deno Edge Functions.
- **Payment Infrastructure**: bKash Tokenized URL Checkout API, Nagad Direct DFS API, SSLCommerz IPN Gateway.
- **Push Notifications**: Firebase Cloud Messaging (FCM) HTTP v1 API.

---

## 3. Monorepo Structure

```
eduvanta/
├── apps/
│   ├── mobile/             # Flutter Android & iOS Application
│   │   ├── lib/
│   │   │   ├── core/       # Theme, Supabase client & Auth state
│   │   │   ├── features/   # SDUI engine, Student, Teacher, Parent modules
│   │   │   └── main.dart
│   │   └── test/           # Flutter widget & unit test suite
│   ├── web/                # Next.js Public Marketing & Campus Portals
│   └── admin/              # Next.js Super Admin Executive Control Center
├── packages/
│   ├── shared-types/       # Canonical TypeScript types & interfaces
│   ├── shared-config/      # Brand tokens, colors & payment gateway presets
│   └── api-contracts/      # Zod validation schemas for all mutations
├── supabase/
│   ├── migrations/         # 12 sequential idempotent SQL migrations
│   ├── functions/          # Deno Edge Functions (pay-verify, sdui-config, fcm-send)
│   └── tests/              # Automated PostgreSQL RLS & tenant isolation tests
├── assets/
│   └── branding/           # Official EDUVANTA logos and banner graphics
├── docs/                   # Complete architecture, database, deployment guides
├── package.json            # Monorepo orchestration (npm workspaces)
├── .env.example            # Environment configuration template
└── README.md
```

---

## 4. Multi-Tenant SaaS Isolation & Security

1. **Airtight Tenant Boundaries**: Every tenant record is indexed with a canonical `school_id`. No client request is permitted to supply or manipulate tenant context directly; all permissions are resolved server-side from `auth.uid()`.
2. **PostgreSQL Row Level Security (RLS)**: Enforced across all platform, academic, financial, attendance, and assignment tables.
3. **Parent-Student Cryptographic Linking**: Parents can strictly read data only for children explicitly linked in `public.parent_student_links`.
4. **Platform Operator Overrides**: Super Admins access platform analytics and manage tenants via security-definer function `public.is_super_admin()`.

---

## 5. Server-Driven UI (SDUI) Engine

EDUVANTA avoids sluggish app store release cycles by decoupling visual presentation from core binary logic:
- **Predefined Safe Component Registry**:
  - `HeroBannerWidget`: Image carousel, session announcements, and dynamic CTAs.
  - `QuickStatsWidget`: Real-time attendance rate, pending assignments, exam GPA, and fee dues.
  - `ActionGridWidget`: Customizable shortcut grid.
  - `AnnouncementFeedWidget`: Campus-wide notices and urgent events.
- **Remote Theme Customization**: School brand colors (Primary Navy, Royal Blue, Gold Accent) update dynamically on mobile and web.
- **Rollback & Versioning**: Every layout change is versioned in `public.configuration_versions` for one-click rollbacks.

---

## 6. Quick Start & Local Run Instructions

### Prerequisites
- Node.js v20+ and npm v10+
- Flutter 3.22+ and Android SDK with JDK 17+

### 1. Install Dependencies
```bash
git clone <repo-url> eduvanta
cd eduvanta
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

### 3. Launch Development Servers
- **Web App & School Portals**:
  ```bash
  npm run web:dev
  ```
  Accessible at `http://localhost:3000`

- **Super Admin Dashboard**:
  ```bash
  npm run admin:dev
  ```
  Accessible at `http://localhost:3001`

- **Flutter Android App**:
  ```bash
  cd apps/mobile
  flutter pub get
  flutter run
  ```

---

## 7. Automated Test Suite Execution

- **Database RLS & Isolation Tests**:
  Execute `supabase/tests/tenant_isolation_test.sql` in Supabase SQL Editor.
- **Flutter Widget & SDUI Unit Tests**:
  ```bash
  cd apps/mobile
  flutter test
  ```
- **TypeScript Workspace Verification**:
  ```bash
  npm run build
  ```

---

## 8. Documentation Index

Detailed engineering documentation is located in the `docs/` directory:
- [Architecture Blueprint](docs/architecture/PROJECT_ARCHITECTURE.md)
- [Database Relational Schema](docs/database/DATABASE_SCHEMA.md)
- [Supabase Setup Guide](docs/setup/SUPABASE_SETUP.md)
- [Firebase Cloud Messaging Setup](docs/setup/FIREBASE_SETUP.md)
- [Environment Setup](docs/setup/ENVIRONMENT_SETUP.md)
- [Android Build Guide](docs/deployment/ANDROID_BUILD_GUIDE.md)
- [Web Deployment Guide](docs/deployment/WEB_DEPLOYMENT_GUIDE.md)
- [Admin Operations Handbook](docs/ADMIN_GUIDE.md)
- [Security & Compliance Guide](docs/security/SECURITY_GUIDE.md)
- [Testing & QA Guide](docs/TESTING_GUIDE.md)
- [Development Status](DEVELOPMENT_STATUS.md)

---

## 9. License & Proprietary Notice

© 2026 EDUVANTA Technologies Ltd. All rights reserved.
"One Platform. Every Campus. Smarter Education."
