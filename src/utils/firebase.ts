import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBW5ZcgOf8_tCOpULk5QV_Tw3rMxEwjp_I",
  authDomain: "react-subproject.firebaseapp.com",
  projectId: "react-subproject",
  storageBucket: "react-subproject.appspot.com",
  messagingSenderId: "513435351485",
  appId: "1:513435351485:web:58ad3d3cd341a388483ad4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
