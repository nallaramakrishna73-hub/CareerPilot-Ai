// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  onAuthStateChanged,
  User 
} from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// User's provided Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtFW4buqg6vJ69CMDTTqP7rBXTi05VEAY",
  authDomain: "career-pilot-ai-f5e8d.firebaseapp.com",
  projectId: "career-pilot-ai-f5e8d",
  storageBucket: "career-pilot-ai-f5e8d.firebasestorage.app",
  messagingSenderId: "1090479975890",
  appId: "1:1090479975890:web:beca67d98e181421e16c0b",
  measurementId: "G-BLXV97RV7V"
};

// Initialize Firebase safely
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize analytics if supported in the browser
export let analytics: any = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Ignore unsupported analytics environments (e.g., ad blockers)
  });
}

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
};
export type { User };
