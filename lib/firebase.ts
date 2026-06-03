import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBkk16TN2qCTpyuh7gLuo-smHvzo09U1GQ",
  authDomain: "myga-it-support-portal.firebaseapp.com",
  projectId: "myga-it-support-portal",
  storageBucket: "myga-it-support-portal.firebasestorage.app",
  messagingSenderId: "929474783629",
  appId: "1:929474783629:web:25ab8e2868c07b974d35c4",
  measurementId: "G-T4TEDFYFFL"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);