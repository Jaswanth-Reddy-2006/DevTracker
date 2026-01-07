import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCPuVeRhWfxbE9CKUULIxKX8imh6K8V6Lg",
  authDomain: "devtracker-fe1d6.firebaseapp.com",
  projectId: "devtracker-fe1d6",
  storageBucket: "devtracker-fe1d6.firebasestorage.app",
  messagingSenderId: "586100076246",
  appId: "1:586100076246:web:3f79a3873512c16697a377",
  measurementId: "G-CES7E3SFE5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export default app;
