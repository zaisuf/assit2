import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const app = getApps().length === 0
  ? initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID || 'assist-442ec',
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      projectId: process.env.FIREBASE_PROJECT_ID || 'assist-442ec',
    })
  : getApps()[0];

const db = getFirestore(app);

export { db };
