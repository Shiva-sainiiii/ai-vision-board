// src/lib/firebase.js
// ─────────────────────────────────────────────────────────────────────────────
// SETUP INSTRUCTIONS:
//   1. Go to https://console.firebase.google.com → your project → Project Settings
//   2. Under "Your apps", copy the firebaseConfig object
//   3. Replace FIREBASE_CONFIG_PLACEHOLDER below with that object
//   4. Enable Google Auth: Authentication → Sign-in method → Google → Enable
//   5. Enable Firestore: Firestore Database → Create database (production mode)
// ─────────────────────────────────────────────────────────────────────────────

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Replace this with your actual Firebase config object from the Firebase console
const firebaseConfig = FIREBASE_CONFIG_PLACEHOLDER; // Replace with your config

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;
