import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCYoOPYtZAlm6UwX0mjfkqWqro4EaVb2sg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "my-portfolio-89f7d.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "my-portfolio-89f7d",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "my-portfolio-89f7d.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "995327088222",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:995327088222:web:2e03d94b76dff2c32f06cf",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-72NBKTRCZN",
};

// Check if valid Firebase configuration is present
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId
);

let app = null;
let auth = null;
let googleProvider = null;
let analytics = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: "select_account" });

    // Initialize Google Analytics if running in browser
    if (typeof window !== "undefined" && firebaseConfig.measurementId) {
      isSupported().then((supported) => {
        if (supported) {
          analytics = getAnalytics(app);
        }
      });
    }
  } catch (error) {
    console.warn("Failed to initialize Firebase:", error);
  }
}

export { app, auth, googleProvider, analytics, signInWithPopup, signOut };
