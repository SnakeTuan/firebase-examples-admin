import { initializeApp, getApps, ServiceAccount, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// Import service account key
import serviceAccount from './test-project-80867-firebase-adminsdk-z13vz-a35db3ec69.json';

let app;

// check if the app is already initialized
if (!getApps().length) {
  app = initializeApp({
    credential: cert(serviceAccount as ServiceAccount)
  });
} 
else {
  app = getApps()[0];
}

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };