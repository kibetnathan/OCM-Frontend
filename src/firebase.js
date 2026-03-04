// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDeC_5Zl_emSgpm-t0F1oiP8kMdm5WVxzs",
  authDomain: "open-church-management.firebaseapp.com",
  projectId: "open-church-management",
  storageBucket: "open-church-management.firebasestorage.app",
  messagingSenderId: "76211400866",
  appId: "1:76211400866:web:aea35ef1ddf30da986a7fb",
  measurementId: "G-50RPTCLSY8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);