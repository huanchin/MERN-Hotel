// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-hotel-f26ab.firebaseapp.com",
  projectId: "mern-hotel-f26ab",
  storageBucket: "mern-hotel-f26ab.appspot.com",
  messagingSenderId: "915581514383",
  appId: "1:915581514383:web:15763dc4a9c96e031af6fa",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
