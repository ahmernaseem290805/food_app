import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBwgtQxXZIIEEaqh-kYWRBT-tBjpiPyEA4",
  authDomain: "ahmerrchfoodapp.firebaseapp.com",
  projectId: "ahmerrchfoodapp",
  storageBucket: "ahmerrchfoodapp.firebasestorage.app",
  messagingSenderId: "185873630125",
  appId: "1:185873630125:web:a142c863848c2e085d1724",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore
export const db = getFirestore(app);
export const storage = getStorage(app);

// Firebase Auth with persistent storage
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export default firebaseConfig;