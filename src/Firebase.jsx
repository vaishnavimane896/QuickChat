import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD4aLBm2_lqo0obZyhCGlikDNv2qIn2i44",
  authDomain: "chatapp-81aa1.firebaseapp.com",
  projectId: "chatapp-81aa1",
  storageBucket: "chatapp-81aa1.firebasestorage.app",
  messagingSenderId: "30824832101",
  appId: "1:30824832101:web:0e9f7077526bb4d224ba8c",
  measurementId: "G-S6NQLJ89X4"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
