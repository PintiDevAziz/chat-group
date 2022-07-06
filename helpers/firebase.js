import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCYFdY9OYELn9GWeAECMe-S-3kmWIwBXfk",
  authDomain: "chat-group-7c45c.firebaseapp.com",
  projectId: "chat-group-7c45c",
  storageBucket: "chat-group-7c45c.appspot.com",
  messagingSenderId: "746150135008",
  appId: "1:746150135008:web:17e8676baaea2a27307c85"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
