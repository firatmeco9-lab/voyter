import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCNoPx_1WyqmfSWEW3ghoHM1wYligyl_Uk",
  authDomain: "voyter.firebaseapp.com",
  projectId: "voyter",
  storageBucket: "voyter.firebasestorage.app",
  messagingSenderId: "17288761213",
  appId: "1:17288761213:web:050340ca9a0dadf6680614",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const storage = getStorage(app);