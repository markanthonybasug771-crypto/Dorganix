# Dorganix

Student portal prototype for Grade 7–12 using Firebase Authentication, Cloud Firestore, and Firebase Hosting.

## Firebase project setup

1. The Firebase project and Web app are registered as `dorganix-d4a15`.
2. In **Authentication → Sign-in method**, enable **Email/Password** before users sign up.
3. The default Cloud Firestore database is created in Singapore (`asia-southeast1`) with deletion protection enabled. The project's rules control access.
4. The Web app config is set in `firebase-config.js`. The web config is client-visible by design; access is protected by Auth and Firestore Security Rules.
5. Install the project tools and sign in to Firebase CLI:

   ```powershell
   npm.cmd install
   npx.cmd firebase login
   ```

6. Deploy the Firestore rules and Hosting site to the configured project:

   ```powershell
   npm.cmd run deploy
   ```

## Admin account

The single configured admin is the Firebase Authentication account with email `Dorganda@high.com`. The app and Firestore rules use that exact authenticated email for admin access; on its first sign-in, the app creates or promotes its Firestore profile to `admin`. The password is managed only by Firebase Authentication and is not stored in this repository. Keep the admin email under school control; changing it requires updating the allowlist in `app.js` and `firestore.rules`.

## Features

- Firebase email/password sign-up, sign-in, and password reset.
- Sign-up collects last name, first name, middle name, birthday, age, gender, address, mobile number, email, and password.
- Birthday, age, gender, address, and mobile number are stored in a private Firestore profile readable only by that account and the admin. Teachers' roster access does not include those private fields.
- Student profiles for Grades 7–12; students see their own marks.
- Teacher registration requires admin approval. Approved teachers can view student rosters and subjects in their grade level.
- Admin-only subject management and grade entry.
- Admins can delete students and their Firestore profile, private profile, and grade records; the Firebase Authentication account must be deleted separately in Firebase Console.
- Firestore Security Rules restrict records by role and grade. The configured admin is verified from the signed-in Firebase Auth email; other profile role fields cannot grant admin access.
- Firebase Hosting configuration and deployment scripts.
- Installable PWA; the login screen hides its install button after installation.
- Responsive layouts for the sign-in flow and student, teacher, and admin portal views across desktop, tablet, and phone screens.
- Admin grade filters and subject assignment use always-visible G7–G12 button menus instead of dropdowns.
- SweetAlert2 notifications, password-reset dialog, and confirmations for account and subject actions.
- Automatic promotion after all required subjects are passed in Terms 1–3, with promotion and Grade 12 graduation notices on the student dashboard.

## Install the app

Open the site over HTTPS in a supported browser and choose **Install app** on the login screen. On browsers without a native install prompt, use the browser menu and choose **Install app** or **Add to Home Screen**. Signing in and loading portal data require an internet connection.

## Data collections

- `users/{uid}` — name, role, grade level, and teacher approval status.
- `privateProfiles/{uid}` — birthday, age, gender, address, and cellphone number; owner/admin read access only.
- `subjects/{subjectId}` — subject name, grade level, and optional teacher assignment.
- `grades/{gradeId}` — student UID, subject, grade level, score, grading period, and entry timestamp.

The current app is a functional MVP. Before storing real student records, finish configuring the Firebase project, deploy the included rules, use a school-controlled admin account, and confirm the school's student data and privacy requirements.

Live site: https://dorganix-d4a15.web.app
