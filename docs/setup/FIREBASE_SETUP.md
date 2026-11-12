# EDUVANTA - Firebase Cloud Messaging (FCM) Setup Guide

This guide walks through configuring Firebase Cloud Messaging for Android push notifications, scheduled alerts, attendance reminders, and examination announcements.

---

## 1. Firebase Project Setup
1. Visit the [Firebase Console](https://console.firebase.google.com/).
2. Create a project named `eduvanta-fcm`.
3. Enable **Cloud Messaging** under Project Settings > Cloud Messaging.
4. Generate a new private key under **Project Settings > Service accounts > Generate new private key**.
5. Save the JSON payload securely and extract the credentials into `.env`:
   ```env
   FIREBASE_PROJECT_ID=eduvanta-fcm
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@eduvanta-fcm.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

---

## 2. Android App Registration
1. In Firebase Console, add an Android App with package name:
   `com.eduvanta.eduvanta_app`
2. Download `google-services.json`.
3. Place `google-services.json` in:
   `apps/mobile/android/app/google-services.json`
4. Verify `apps/mobile/android/build.gradle.kts` includes the Google Services classpath:
   ```kotlin
   buildscript {
       dependencies {
           classpath("com.google.gms:google-services:4.4.1")
       }
   }
   ```

---

## 3. Web Push Notification Key (VAPID)
1. In Firebase Console > Project Settings > Cloud Messaging, navigate to **Web configuration**.
2. Generate a key pair (VAPID key).
3. Set `NEXT_PUBLIC_FIREBASE_VAPID_KEY` in `.env`.

---

## 4. Testing Notification Dispatch
Trigger notification dispatch via the Super Admin portal at `http://localhost:3001/notifications` or by calling the Supabase Edge Function `fcm-send`:
```bash
curl -X POST https://<your-project-ref>.supabase.co/functions/v1/fcm-send \
  -H "Authorization: Bearer <service-role-key>" \
  -H "Content-Type: application/json" \
  -d '{
    "schoolId": "22222222-2222-2222-2222-222222222201",
    "title": "Admit Cards Ready",
    "body": "Mid-term examination admit cards are ready for download.",
    "type": "exam"
  }'
```
