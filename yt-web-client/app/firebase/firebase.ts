
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFunctions } from "firebase/functions";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "API-KEY",
  authDomain: "yt-clone-77223.firebaseapp.com",
  projectId: "yt-clone-77223",
  appId: "1:552393460649:web:d7a83e6ccd48c6e08f92b8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
export const functions = getFunctions(app);

/**
 * Signs the user in with a Google popup.
 * @returns A promise that resolves with the user's credentials.
 */
 export function signInWithGoogle() {
    return signInWithPopup(auth, new GoogleAuthProvider());
  }
  
  /**
   * Signs the user out.
   * @returns A promise that resolves when the user is signed out.
   */
  export function signOut() {
    return auth.signOut();
  }
  
  /**
   * Trigger a callback when user auth state changes.
   * @returns A function to unsubscribe callback.
   */
  export function onAuthStateChangedHelper(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }
