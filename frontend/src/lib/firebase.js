import { initializeApp } from "firebase/app";
import { getAuth, GithubAuthProvider, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const functions = getFunctions(app);

if (import.meta.env.DEV) {
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
}

let currentUser = null;
let authReady = false;
let authReadyResolvers = [];

onAuthStateChanged(auth, (user) => {
  currentUser = user;
  authReady = true;
  authReadyResolvers.forEach((resolve) => resolve(user));
  authReadyResolvers = [];
});

export function getCurrentUser() {
  if (authReady) {
    return Promise.resolve(currentUser);
  }

  return new Promise((resolve) => {
    authReadyResolvers.push(resolve);
  });
}

export const githubProvider = new GithubAuthProvider();
githubProvider.addScope("repo");
