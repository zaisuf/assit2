'use client'

import { initializeApp, getApps } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyArBgf69uArHUyvBMNwF6JSjA6G7wWzKxc",
  authDomain: "assist-442ec.firebaseapp.com",
  projectId: "assist-442ec",
  storageBucket: "assist-442ec.firebasestorage.app",
  messagingSenderId: "386248189784",
  appId: "1:386248189784:web:99f2c1cbda1a29fc74672d",
  measurementId: "G-LQZL8WN2T1"
};

let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
const auth = getAuth(app);
// Set persistence to local to avoid CORS issues
setPersistence(auth, browserLocalPersistence);

// Configure auth settings
auth.useDeviceLanguage();

const db = getFirestore(app);
const storage = getStorage(app);
let analytics;

// Only initialize analytics on the client side
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { auth, db, storage, analytics };
export default app;