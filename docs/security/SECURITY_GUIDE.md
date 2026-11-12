# EDUVANTA - Enterprise SaaS Security & Compliance Guide

This guide establishes the mandatory security rules, encryption standards, and isolation policies governing the EDUVANTA Smart Campus Management Ecosystem.

---

## 1. Multi-Tenant Row Level Security (RLS) Architecture

1. **Mandatory RLS**: Every table holding tenant data (`schools`, `student_fees`, `attendance_records`, `exam_marks`, `assignments`, etc.) MUST have Row Level Security enabled.
2. **Server-Side Authorization**: The active user's identity is derived exclusively from `auth.uid()` inside Supabase JWTs.
3. **Never Trust Client-Supplied Identifiers**: The client cannot submit an arbitrary `school_id` or `role` to read or modify data.
4. **Security Definer Validation**:
   - `public.is_super_admin()`: Confirms platform operator role.
   - `public.is_member_of_school(school_id, allowed_roles)`: Checks tenant membership and specific privileges.
   - `public.is_parent_of(student_id)`: Enforces that parents only access their verified children.

---

## 2. API Key Management & Key Boundaries

| Key Type | Permitted Locations | Strictly Prohibited Locations |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Web frontend, mobile client | None |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side API routes, Edge Functions | Public repos, client JS, Flutter APK/AAB |
| `BKASH_APP_SECRET`, `NAGAD_PRIVATE_KEY` | Secure server backend only | Any client-side bundle |

---

## 3. Financial Transaction Security

- Transactions transition from `pending` to `completed` **only** after verified cryptographic callback from bKash, Nagad, or SSLCommerz IPN servers.
- Every payment automatically generates a tamper-evident digital receipt with a unique serial number (`RCP-YYYY-XXXXXX`).
- Double-spend protection is enforced by unique constraints on `(gateway, merchant_invoice_number)`.

---

## 4. Immutable Audit Logging

All administrative mutations (school provisioning, mark entries, role assignments, SDUI publications) trigger automated audit log entries in `public.audit_logs`, capturing:
- Operator UUID
- Timestamp (UTC)
- Action type & entity modified
- Client IP address and user agent
- Before/after JSON delta metadata
