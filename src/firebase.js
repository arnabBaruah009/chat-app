// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDe4YkaOU4LUZShA9_xxPYK12tpxW-ztH4",
  authDomain: "chatapp-6f878.firebaseapp.com",
  projectId: "chatapp-6f878",
  storageBucket: "chatapp-6f878.appspot.com",
  messagingSenderId: "107681558517",
  appId: "1:107681558517:web:640151620b5ad0d7a33abc"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore(app);
