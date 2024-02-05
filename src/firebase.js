// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBf1cOS1_rjD9__SsGoGlj41qp5CiNup5E",
  authDomain: "chat-app-c5fa6.firebaseapp.com",
  projectId: "chat-app-c5fa6",
  storageBucket: "chat-app-c5fa6.appspot.com",
  messagingSenderId: "57787536248",
  appId: "1:57787536248:web:f19c8f07bb151605a9ee8d",
  measurementId: "G-80Q5X4LLNC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const waitingListCollection = collection(db, "waitingList")
export const chatCollection = collection(db,"chatList")