// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyAgiQ_PC-9tCLrJISxUY7Ix2ZgoQSVMgDs",
  authDomain: "quiz-a81af.firebaseapp.com",
  projectId: "quiz-a81af",
  storageBucket: "quiz-a81af.appspot.com",
  messagingSenderId: "353070593903",
  appId: "1:353070593903:web:8658340a80f2877e2b1a9a",
  measurementId: "G-9EEE93M7KL"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);  // Initialize Auth
const db = getFirestore(app);  // Initialize Firestore
const analytics = getAnalytics(app);  // Initialize Analytics (if needed)

export { app, auth, db, analytics };  // Export auth, db, and other needed objects
