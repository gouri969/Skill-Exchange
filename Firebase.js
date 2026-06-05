// src/firebase/Firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD_aYu9P27HMnASNCwPyZ2YWrORzo97wBo",
  authDomain: "exchangeskill-58b78.firebaseapp.com",
  databaseURL: "https://exchangeskill-58b78-default-rtdb.firebaseio.com",
  projectId: "exchangeskill-58b78",
  storageBucket: "exchangeskill-58b78.firebasestorage.app",
  messagingSenderId: "219377499922",
  appId: "1:219377499922:web:3c372f081b4d5eefc8fdcb",
  measurementId: "G-FVW2G8F1XY"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Auth
export const auth = getAuth(app);

// 🔥 Login session browser close पर्यंत टिकेल
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Login session saved");
  })
  .catch((error) => {
    console.log("Persistence error:", error);
  });

// Firestore
export const db = getFirestore(app);
export const database = db;

// Collections
export const usersRef = collection(db, "users");
export const requestsRef = collection(db, "requests");
export const timeBankRef = collection(db, "timebank");
export const ratingsRef = collection(db, "ratings");

export default app;