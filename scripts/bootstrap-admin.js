const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

async function main() {
  const email = process.argv[2];
  const name = process.argv[3] || 'Dorganix Admin';
  const projectId = process.env.GCLOUD_PROJECT || process.env.FIREBASE_PROJECT_ID;
  if (!email || !projectId) {
    console.error('Usage: set FIREBASE_PROJECT_ID and GOOGLE_APPLICATION_CREDENTIALS, then run: npm run bootstrap:admin -- admin@school.edu "Admin Name"');
    process.exitCode = 1;
    return;
  }
  initializeApp({ credential: applicationDefault(), projectId });
  const auth = getAuth();
  const firestore = getFirestore();
  const user = await auth.getUserByEmail(email);
  let nextPageToken;
  do {
    const page = await auth.listUsers(1000, nextPageToken);
    const anotherAdmin = page.users.find(candidate => candidate.uid !== user.uid && candidate.customClaims?.admin === true);
    if (anotherAdmin) {
      throw new Error(`An admin account is already configured (${anotherAdmin.email || anotherAdmin.uid}). Only one Dorganix admin is allowed.`);
    }
    nextPageToken = page.pageToken;
  } while (nextPageToken);
  const claims = { ...(user.customClaims || {}), admin: true };
  await auth.setCustomUserClaims(user.uid, claims);
  await firestore.collection('users').doc(user.uid).set({
    name,
    email: user.email,
    role: 'admin',
    gradeLevel: null,
    studentId: '',
    approved: true,
    createdAt: FieldValue.serverTimestamp()
  }, { merge: true });
  console.log(`Admin access granted to ${user.email} (${user.uid}). Sign out and back in to refresh the token.`);
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
