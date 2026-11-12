# EDUVANTA - Android Build & Release Engineering Guide

This document details the exact procedures for generating Debug APKs, Release APKs, and Google Play Store Android App Bundles (AAB).

---

## 1. Prerequisites
- Flutter 3.22+ or 3.38+ installed and configured on PATH.
- Android SDK (API 34+) with `cmdline-tools` installed.
- Java JDK 17+ configured via `JAVA_HOME`.
- Verify environment with:
  ```bash
  flutter doctor
  ```

---

## 2. Generating Android Debug APK

To compile an unsigned debug APK for local testing on emulators and physical devices:

```bash
cd apps/mobile
flutter build apk --debug
```

The resulting binary is generated at:
`apps/mobile/build/app/outputs/flutter-apk/app-debug.apk`

---

## 3. Signing Configuration for Production Release

1. **Generate a Production Keystore**:
   ```bash
   keytool -genkey -v -keystore eduvanta-release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias eduvanta
   ```
2. **Create `key.properties`**:
   In `apps/mobile/android/key.properties`:
   ```properties
   storePassword=<password>
   keyPassword=<password>
   keyAlias=eduvanta
   storeFile=eduvanta-release.jks
   ```
3. **Configure Gradle Signing**:
   In `apps/mobile/android/app/build.gradle.kts`:
   ```kotlin
   val keystoreProperties = Properties()
   val keystorePropertiesFile = rootProject.file("key.properties")
   if (keystorePropertiesFile.exists()) {
       keystoreProperties.load(FileInputStream(keystorePropertiesFile))
   }

   android {
       signingConfigs {
           create("release") {
               keyAlias = keystoreProperties["keyAlias"] as String
               keyPassword = keystoreProperties["keyPassword"] as String
               storeFile = file(keystoreProperties["storeFile"] as String)
               storePassword = keystoreProperties["storePassword"] as String
           }
       }
       buildTypes {
           release {
               signingConfig = signingConfigs.getByName("release")
               isMinifyEnabled = true
               isShrinkResources = true
               proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
           }
       }
   }
   ```

---

## 4. Generating Production Release APK

```bash
cd apps/mobile
flutter build apk --release
```
Output path:
`apps/mobile/build/app/outputs/flutter-apk/app-release.apk`

---

## 5. Generating Android App Bundle (AAB) for Google Play

Google Play Console requires the `.aab` format:
```bash
cd apps/mobile
flutter build appbundle --release
```
Output path:
`apps/mobile/build/app/outputs/bundle/release/app-release.aab`
