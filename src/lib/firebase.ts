import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDJTY4NYkEXMhlk0q6fQQnG2RZ2NCnCawQ",
  authDomain: "cntoptan-1fe67.firebaseapp.com",
  projectId: "cntoptan-1fe67",
  storageBucket: "cntoptan-1fe67.firebasestorage.app",
  messagingSenderId: "1070985925992",
  appId: "1:1070985925992:web:922cb3c4bd849f251732dd",
  measurementId: "G-95NHFMT7YL",
};

const app: FirebaseApp = getApps().length ? getApps()[0] as FirebaseApp : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);

if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      getAnalytics(app);
    }
  });
}

export { app };
