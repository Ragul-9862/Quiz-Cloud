// src/hooks/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAgiQ_PC-9tCLrJISxUY7Ix2ZgoQSVMgDs",
  authDomain: "quiz-a81af.firebaseapp.com",
  projectId: "quiz-a81af",
  storageBucket: "quiz-a81af.appspot.com",
  messagingSenderId: "353070593903",
  appId: "1:353070593903:web:8658340a80f2877e2b1a9a",
  measurementId: "G-9EEE93M7KL",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
