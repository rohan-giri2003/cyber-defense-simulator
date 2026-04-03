import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAsNmte6IdigJtZGaNy4FK5ZO1RwGjX4c",
  authDomain: "cyberdefence-app.firebaseapp.com",
  projectId: "cyberdefence-app",
  storageBucket: "cyberdefence-app.firebasestorage.app",
  messagingSenderId: "489528872563",
  appId: "1:489528872563:web:a3547ed184772bce34e0f0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Database export karna zaruri hai taaki App.js ise use kar sake
export const db = getFirestore(app);