# EDUVANTA Supabase Setup Guide

This guide details how to configure Supabase Cloud or a local Supabase environment for the EDUVANTA Smart Campus Management Ecosystem.

---

## 1. Prerequisites
- [Supabase CLI](https://supabase.com/docs/guides/cli) or an active Supabase Cloud project.
- Node.js v18+ and PostgreSQL 15+.

---

## 2. Deploying Migrations to Supabase Cloud

1. **Log in to Supabase CLI**:
   ```bash
   npx supabase login
   ```

2. **Link your Supabase Project**:
   ```bash
   npx supabase link --project-ref <your-project-ref>
   ```

3. **Push all SQL Migrations**:
   ```bash
   npx supabase db push
   ```
   This will execute all sequential migrations located in `supabase/migrations/`:
   - `00001_initial_platform_and_tenants.sql`
   - `00002_users_and_memberships.sql`
   - `00003_academic_and_timetables.sql`
   - `00004_attendance_and_leaves.sql`
   - `00005_examinations_and_grades.sql`
   - `00006_assignments_and_materials.sql`
   - `00007_finance_and_payments.sql`
   - `00008_library_and_transport.sql`
   - `00009_communication_and_support.sql`
   - `00010_server_driven_ui.sql`
   - `00011_row_level_security_policies.sql`
   - `00012_seed_data.sql`

---

## 3. Storage Bucket Provisioning

In your Supabase Dashboard under **Storage**, create the following buckets:

| Bucket Name | Public Access | Max File Size | Allowed MIME Types |
|---|---|---|---|
| `school-logos` | **Public** | 5 MB | `image/png`, `image/jpeg`, `image/webp`, `image/svg+xml` |
| `profile-images` | **Public** | 5 MB | `image/png`, `image/jpeg`, `image/webp` |
| `study-materials` | **Private** | 100 MB | PDF, DOCX, PPTX, XLSX, MP4, ZIP |
| `assignments` | **Private** | 50 MB | PDF, DOCX, Images |
| `assignment-submissions` | **Private** | 50 MB | PDF, ZIP, Images |
| `receipts` | **Private** | 10 MB | PDF |

---

## 4. Supabase Authentication Setup

1. **Enable Email/Password Provider**:
   - Navigate to **Authentication > Providers > Email**.
   - Enable "Allow new users to sign up" (or restrict to invite-only for tenant members).
   - Configure password requirements (minimum 8 characters, letter + number).

2. **Configure Redirect URLs**:
   - Web App: `http://localhost:3000/auth/callback`
   - Admin App: `http://localhost:3001/auth/callback`
   - Production Domain: `https://eduvanta.com/auth/callback`
   - Mobile Deep Link: `eduvanta://auth/callback`

---

## 5. Verification & Test Execution

Run the tenant isolation test suite in SQL Editor or via CLI:
```bash
npx supabase test db
```
or run `supabase/tests/tenant_isolation_test.sql` directly in Supabase SQL Editor.
