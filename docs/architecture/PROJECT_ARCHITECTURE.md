# EDUVANTA - Project Architecture Document

**System Name**: EDUVANTA Smart Campus Management Ecosystem  
**Tagline**: "One Platform. Every Campus. Smarter Education."  
**Architecture Classification**: Multi-Tenant B2B2C Educational SaaS with Server-Driven UI (SDUI)

---

## 1. System Topology & High-Level Architecture

EDUVANTA is designed as a centralized cloud-native platform serving thousands of educational institutions (tenants), their platform administrators, school leaders, educators, students, parents, and support staff across web and mobile platforms.

```
                           +-------------------------------------+
                           |            EDUVANTA SAAS            |
                           |     Multi-Tenant Cloud Platform     |
                           +-------------------------------------+
                                              |
               +------------------------------+------------------------------+
               |                                                             |
+------------------------------+                             +------------------------------+
|     Next.js Web Frontend     |                             |   Flutter Android & iOS App  |
|  - Public Marketing Landing  |                             |  - Server-Driven UI (SDUI)   |
|  - Super Admin Dashboard     |                             |  - Student Portal Mobile     |
|  - School Admin Portal       |                             |  - Teacher Portal Mobile     |
|  - Teacher / Staff Portal    |                             |  - Parent Multi-Child Portal |
|  - Student & Parent Web      |                             |  - Push Notifications (FCM)  |
+------------------------------+                             +------------------------------+
               |                                                             |
               +------------------------------+------------------------------+
                                              |
                                              v
                              +-------------------------------+
                              |    SUPABASE UNIFIED BACKEND   |
                              |  - Postgres with Strict RLS   |
                              |  - Supabase Auth (JWT / RBAC) |
                              |  - Realtime Change Streams    |
                              |  - Secure Storage Buckets     |
                              |  - Deno Edge Functions        |
                              +-------------------------------+
                                              |
                         +--------------------+--------------------+
                         |                                         |
            +--------------------------+              +--------------------------+
            |  Firebase Cloud Messaging|              | Bangladesh Gateways      |
            |  - Device token registry |              | - bKash Checkout (URL)   |
            |  - Target topics & users |              | - Nagad Merchant API     |
            |  - Attendance / Fee pings|              | - SSLCommerz IPN         |
            +--------------------------+              +--------------------------+
```

---

## 2. Multi-Tenant SaaS Isolation Model

### 2.1 Tenant Identifiers & Scope
- Every tenant is designated by a canonical UUID `school_id` residing in `public.schools`.
- Every tenant-owned table in PostgreSQL explicitly stores `school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE`.
- User identities reside in `auth.users` and are mirrored into `public.profiles`.
- A user can belong to multiple schools with different roles via `public.school_memberships`.
- The Super Admin and Platform Admins reside in `public.platform_admins` and bypass tenant constraints through explicitly designated platform-level RLS policies, while regular users are strictly constrained by their active `school_id` and verified membership.

### 2.2 Row Level Security (RLS) Enforcement Principle
1. **Never trust client-supplied tenant IDs**: The client cannot simply pass `?school_id=xyz` or a body property to tamper with data.
2. **Server-side validation**: Every request authenticated with Supabase Auth carries a JWT containing `auth.uid()`.
3. **Database Function Validation**:
   ```sql
   CREATE OR REPLACE FUNCTION public.is_member_of_school(school_id UUID, allowed_roles user_role_enum[] DEFAULT NULL)
   RETURNS BOOLEAN AS $$
     SELECT EXISTS (
       SELECT 1 FROM public.school_memberships
       WHERE user_id = auth.uid()
         AND school_memberships.school_id = $1
         AND status = 'active'
         AND ($2 IS NULL OR role = ANY($2))
     );
   $$ LANGUAGE sql SECURITY DEFINER STABLE;
   ```
4. **Platform Admin Override**:
   ```sql
   CREATE OR REPLACE FUNCTION public.is_super_admin()
   RETURNS BOOLEAN AS $$
     SELECT EXISTS (
       SELECT 1 FROM public.platform_admins
       WHERE user_id = auth.uid()
         AND role IN ('super_admin', 'platform_admin')
         AND status = 'active'
     );
   $$ LANGUAGE sql SECURITY DEFINER STABLE;
   ```

---

## 3. Server-Driven UI (SDUI) Framework

To allow the Super Admin and School Administrators to customize layouts, banners, action shortcuts, and themes without requiring client app updates, EDUVANTA uses an approved-component SDUI engine.

### Safe Component Registry
The mobile client and web client implement strict JSON schemas with no dynamic evaluation or remote JavaScript execution:
- `HeroBannerWidget`: Image carousel, announcement text, call to action.
- `QuickStatsWidget`: Attendance percentage, pending assignments, fee dues, exam scores.
- `ActionGridWidget`: Customizable grid of shortcuts (Attendance, Results, Timetable, Fees, etc.).
- `TimetableCardWidget`: Today's classes, current subject, teacher name, room number.
- `AnnouncementFeedWidget`: School-wide or class-specific notices.
- `PaymentPromptWidget`: Outstanding invoice reminder with pay now trigger.

---

## 4. Brand Identity Specifications

- **Primary Navy**: `#102A56` (Dominant headers, cards, dark theme backgrounds)
- **Royal Blue**: `#2563EB` (Primary interactive buttons, highlights)
- **Electric Blue**: `#3B82F6` (Active states, badges, gradients)
- **Gold Accent**: `#F5B82E` (Badges, ratings, student stars, warnings)
- **Background**: `#F5F8FC` (Clean soft background for high contrast reading)
- **White**: `#FFFFFF` (Surface cards, inputs)
- **Text Primary**: `#17243A` (Crisp readability)
- **Success**: `#16A34A`
- **Danger**: `#DC2626`
