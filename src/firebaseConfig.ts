import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC7WCskBX2dhSEERj02UfKX2LJH3Kb5HPQ",
  authDomain: "sheyshop-nextjs.firebaseapp.com",
  projectId: "sheyshop-nextjs",
  storageBucket: "sheyshop-nextjs.appspot.com",
  messagingSenderId: "634966104168",
  appId: "1:634966104168:web:9b6cec70d031b05dc503dd",
  measurementId: "G-QGDH253G3W",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
