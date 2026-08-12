import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCVJlgLcXZXFsDSWxO4XPIlpOS7k8sy2O0",
    authDomain: "universal-erp-5457.firebaseapp.com",
    projectId: "universal-erp-5457",
    storageBucket: "universal-erp-5457.firebasestorage.app",
    messagingSenderId: "982536869039",
    appId: "1:982536869039:web:8e949c0bca957bbd51f05a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
