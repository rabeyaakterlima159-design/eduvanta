# EDUVANTA Database Schema Documentation

**Target Engine**: PostgreSQL 15+ (Supabase Managed)  
**Schema Architecture**: Multi-Tenant with Tenant-Scoped Row Level Security (RLS)  
**Identity Source**: `auth.users`  

---

## 1. Schema Overview & Relational Map

The EDUVANTA database is segregated into 12 core table groups:

```
+-------------------------------------------------------------------------------------------------+
|                                     PLATFORM LEVEL                                              |
|  [subscription_plans] <---+                                                                     |
|                           | (plan_id)                                                           |
|                     [schools] <---+ (school_id)                                                 |
|                     - id (UUID)   |                                                             |
|                     - code        |                                                             |
|                     - status      +-------------------------------------------+                 |
|                                   |                                           |                 |
+-----------------------------------|-------------------------------------------|-----------------+
                                    |                                           |
+-----------------------------------|------------------+  +---------------------|-----------------+
|              USERS & RBAC         |                  |  |             ACADEMIC STRUCTURE        |
|  [auth.users]                     |                  |  |  [academic_sessions]                |
|       ^                           |                  |  |       ^                               |
|       | (id)                      |                  |  |       |                               |
|  [profiles] <---------------------+                  |  |  [classes]                            |
|       ^               ^                              |  |       ^                               |
|       |               |                              |  |       |                               |
|  [school_memberships] +                              |  |  [sections]                           |
|  - role: school_owner, school_admin, teacher,        |  |       ^                               |
|          student, parent, staff...                   |  |       |                               |
|                                                      |  |  [student_enrollments]                |
|  [parent_student_links]                              |  |  - roll_number                        |
|  - parent_id -> profiles                             |  |  - status                             |
|  - student_id -> profiles                            |  |                                       |
+------------------------------------------------------+  +---------------------------------------+
                                    |                                           |
+-----------------------------------|------------------+  +---------------------|-----------------+
|            FINANCE & PAYMENTS     |                  |  |             SERVER-DRIVEN UI          |
|  [fee_categories]                 |                  |  |  [app_configurations]                 |
|  [fee_structures]                 |                  |  |  - school_id (NULL = Platform Default)|
|  [student_fees] <-----------------+                  |  |  - role_target                        |
|  - invoice_number                                    |  |  - layout_data (JSONB)                |
|  - total_payable                                     |  |  [configuration_versions]             |
|  - balance_due                                       |  |  - instant rollback snapshot          |
|  [payment_transactions]                              |  |  [feature_flags]                      |
|  - gateway: bkash, nagad, sslcommerz                 |  |  [app_versions]                       |
|  [receipts]                                          |  |  [maintenance_settings]               |
+------------------------------------------------------+  +---------------------------------------+
```

---

## 2. Table Groups Reference

### Group 1: Platform & Tenant Governance
- `subscription_plans`: Defines Free, Basic, Pro, Enterprise tiers and quota limits.
- `platform_admins`: Platform-wide super admins and staff.
- `schools`: Tenant entity records with code, status, expiration.
- `school_settings`: School-specific branding, currency, timezone, and module toggles.
- `school_domains`: Custom white-labeled domains (e.g. `portal.dhakapremier.edu.bd`).
- `audit_logs`: Immutable tracking of admin actions.

### Group 2: Identity & Relationships
- `profiles`: Extends Supabase `auth.users` with names, contact details, emergency contacts.
- `school_memberships`: Ties a profile to a tenant with specific role permissions.
- `parent_student_links`: Enforces strict parent-child verification.
- `user_devices`: FCM push notification tokens for Android/iOS/Web.

### Group 3: Academic Engine
- `academic_sessions`: Academic years (e.g., 2026-2027).
- `classes`: Standard grade levels (e.g., Class 10, Class 9).
- `sections`: Class branches (e.g., Section A, Section B).
- `subjects`: Core and elective subjects with credit hours and passing thresholds.
- `student_enrollments`: Links student profile to section and roll number.
- `timetables`: Daily timetable schedule slots.

### Group 4: Attendance & Leave Management
- `attendance_records`: Daily/subject-wise attendance with status (`present`, `absent`, `late`, `excused`).
- `staff_attendance_records`: Check-in/check-out tracking for teachers and campus staff.
- `leave_requests`: Leave application and approval workflow.

### Group 5: Examinations & Grading
- `grading_systems`: GPA 5.0, letter grades, percentage mappings.
- `examinations`: Scheduled exams.
- `exam_subjects`: Date, time, room, and marks distribution.
- `exam_marks`: Teacher marks entry.
- `exam_results`: Published report cards and ranking.

### Group 6: Assignments & Course Materials
- `assignments`: Homework, deadlines, attachments.
- `assignment_submissions`: Student submission uploads and teacher grading.
- `study_materials`: Lecture notes, syllabus, reference files.

### Group 7: Finance & Bangladesh Payment Gateways
- `fee_categories`: Tuition, Lab, Library, Transport fee types.
- `fee_structures`: Class-level fee schedules.
- `student_fees`: Invoices with due dates and balances.
- `payment_transactions`: Real-time bKash Checkout, Nagad, and SSLCommerz transaction logs.
- `receipts`: Generated digital payment receipts.

### Group 8: Server-Driven UI (SDUI)
- `app_configurations`: Layouts, navigation order, theme overrides.
- `configuration_versions`: Version history with rollback capability.
- `feature_flags`: Dynamic feature flags.
- `app_versions`: Minimum app version policy and force-update triggers.
- `maintenance_settings`: Remote maintenance mode banner and access controls.

---

## 3. Storage Buckets & Policies

1. `school-logos`: Public read, school admin write.
2. `profile-images`: Authenticated read, owner write.
3. `study-materials`: School members read, teacher write.
4. `assignments`: School members read, teacher write.
5. `assignment-submissions`: Submitting student and teacher read/write.
6. `receipts`: Student, parent, accountant read; server write.
