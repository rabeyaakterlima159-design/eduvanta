# EDUVANTA - Administrator Operations & Governance Guide

This handbook instructs Super Admins and Campus Leaders on operating the EDUVANTA platform.

---

## 1. Super Admin Operations

### Provisioning a New Campus Tenant:
1. Open the Super Admin Dashboard at `http://localhost:3001/schools`.
2. Click **Provision New School**.
3. Supply Campus Full Name, Unique School Code (e.g., `SCH-DPIS-01`), Administrative Email, City, and Subscription Plan.
4. Set default branding colors and motto.
5. Click **Provision Tenant**. The system automatically creates the tenant record, default branding, and initial academic session.

### Managing Server-Driven UI (SDUI) & Remote Layouts:
1. Navigate to **SDUI & Remote Config** (`/sdui-builder`).
2. Reorder dashboard widgets using the Move Up / Move Down controls.
3. Toggle widget visibility or customize theme colors.
4. Observe the interactive live mobile phone preview updating in real-time.
5. Click **Publish Version** to broadcast the update to all active mobile devices and web clients.
6. Use **Rollback** to immediately restore the prior configuration if needed.

### Broadcasting Emergency Notifications:
1. Navigate to **Push Notifications** (`/notifications`).
2. Choose target: All Campuses, Specific School, or Specific Role (Students/Teachers/Parents).
3. Enter title and message body.
4. Click **Broadcast FCM Push Notification**.

---

## 2. School Administrator & Principal Operations

### Daily Campus Management:
- **Attendance**: Review real-time student and faculty presence percentages.
- **Examinations**: Publish term examination schedules and grade boundaries.
- **Fees**: Generate monthly tuition fee invoices and track collection rates.
- **Fleet & Library**: Monitor vehicle routes and textbook inventory.
