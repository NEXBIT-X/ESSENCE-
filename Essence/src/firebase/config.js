// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDX_M2Wchnvp1fhyGf2iFPUWVizhRqTvrA",
  authDomain: "essence-606fd.firebaseapp.com",
  projectId: "essence-606fd",
  storageBucket: "essence-606fd.firebasestorage.app",
  messagingSenderId: "215612781738",
  appId: "1:215612781738:web:2b20c255b27fbb28f70cd3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
