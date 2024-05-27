import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "chat-bc2e9.firebaseapp.com",
  projectId: "chat-bc2e9",
  storageBucket: "chat-bc2e9.appspot.com",
  messagingSenderId: "419815036294",
  appId: "1:419815036294:web:413f05b172caeaa9570807"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()
