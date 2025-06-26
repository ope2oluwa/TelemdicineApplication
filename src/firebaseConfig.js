import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDdYVvvdI0hXGizD-_O-vsw17BhI_1Fr4A",
  authDomain: "mental-health-platform-3de06.firebaseapp.com",
  projectId: "mental-health-platform-3de06",
  storageBucket: "mental-health-platform-3de06.firebasestorage.app",
  messagingSenderId: "597668214283",
  appId: "1:597668214283:web:cf1dc3a7f0034201fd390e",
  measurementId: "G-3XQKS1GFWW",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const messaging = getMessaging(app);

export { auth, db, googleProvider, messaging };
