# EDUVANTA - Testing & Quality Assurance Guide

This guide describes how to run and extend the automated test suites covering Database RLS, API Contracts, Web components, and Flutter mobile widgets.

---

## 1. Test Suite Architecture

| Layer | Framework / Engine | Location | Scope |
|---|---|---|---|
| **Database & RLS** | PostgreSQL / SQL Test Suite | `supabase/tests/tenant_isolation_test.sql` | Tenant isolation, RLS rules, cross-school restriction |
| **API Contracts** | TypeScript / Zod | `packages/api-contracts` | Input validation & type assertions |
| **Flutter Mobile** | Flutter Test / WidgetTester | `apps/mobile/test/widget_test.dart` | SDUI rendering, theme parser, student dashboard |
| **Web & Admin** | Next.js / TypeScript | `apps/web` & `apps/admin` | Page rendering, navigation, component states |

---

## 2. Executing Database RLS & Tenant Isolation Tests

To verify that tenants cannot read or write across school boundaries:
```sql
-- In Supabase SQL Editor or via CLI:
\i supabase/tests/tenant_isolation_test.sql
```

The test validates:
1. `relrowsecurity` is enabled on all tenant tables.
2. `is_super_admin()` returns false for unauthenticated sessions.
3. `is_member_of_school()` rejects non-members.
4. `is_parent_of()` restricts access to unlinked students.

---

## 3. Executing Flutter Mobile Tests

Run all unit and widget tests:
```bash
cd apps/mobile
flutter test
```

Expected output:
```
00:03 +3: All tests passed!
```

---

## 4. Executing Web Type Checks & Builds

Verify TypeScript typings across the workspace:
```bash
npm run build
```
