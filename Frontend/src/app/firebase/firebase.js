// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyDUVoJHRR6KQ2AYxkZODUq_cSoKsDam3fY",
    authDomain: "mobile-auth-31540.firebaseapp.com",
    projectId: "mobile-auth-31540",
    storageBucket: "mobile-auth-31540.firebasestorage.app",
    messagingSenderId: "643718857201",
    appId: "1:643718857201:web:42f54d4aa91e4d60e08450",
    measurementId: "G-BBFWRSYKYW"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
//auth.useDeviceLanguage();

export { app, auth };