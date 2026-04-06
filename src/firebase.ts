import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCam5uicLFnNHqbHHFk2HQqshQmSNPiP-I",
  authDomain: "jesus-songs-book-49f6e.firebaseapp.com",
  projectId: "jesus-songs-book-49f6e",
  storageBucket: "jesus-songs-book-49f6e.firebasestorage.app",
  messagingSenderId: "963939883056",
  appId: "1:963939883056:web:9e05aa3b3b169adb5cf5f5",
  measurementId: "G-5V5H0MTQVC"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
