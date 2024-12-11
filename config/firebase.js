import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAL45M5wAW7lmH1ZntiL2GDseoEkJM4rXU",
  authDomain: "coffeeapp-77dae.firebaseapp.com",
  projectId: "coffeeapp-77dae",
  storageBucket: "coffeeapp-77dae.firebasestorage.app",
  messagingSenderId: "888337175348",
  appId: "1:888337175348:web:f6d3caffbe1945fbf0cb61",
  measurementId: "G-B2LZ71BH9S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;