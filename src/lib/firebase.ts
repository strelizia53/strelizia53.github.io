// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBH84a03XVsuP6pXqHKe2FTz-BPAH2st-s",
  authDomain: "portfolio-6f936.firebaseapp.com",
  projectId: "portfolio-6f936",
  storageBucket: "portfolio-6f936.firebasestorage.app",
  messagingSenderId: "3190296471",
  appId: "1:3190296471:web:3111ec835346bd434c7ed2",
  measurementId: "G-0E2N1ZPYHT",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, db, storage, auth };
