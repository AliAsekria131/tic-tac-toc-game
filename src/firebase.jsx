
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, update } from "firebase/database";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8gRyl5KtJWuorJCfHrWpADCF1AG8rgco",
  authDomain: "xo-game-36cf7.firebaseapp.com",
  databaseURL: "https://xo-game-36cf7-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "xo-game-36cf7",
  storageBucket: "xo-game-36cf7.firebasestorage.app",
  messagingSenderId: "428712197180",
  appId: "1:428712197180:web:4bedf353a4d940f62d1739"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, set, onValue, update };


