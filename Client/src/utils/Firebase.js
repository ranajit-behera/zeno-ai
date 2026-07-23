import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "voiceagent-f13ce.firebaseapp.com",
    projectId: "voiceagent-f13ce",
    storageBucket: "voiceagent-f13ce.firebasestorage.app",
    messagingSenderId: "833012206601",
    appId: "1:833012206601:web:9880b512409b99b8eefcd8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {auth, provider};