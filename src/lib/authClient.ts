// lib/authClient.ts
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "./firebaseClient";

/**
 * Sign up with email and password
 * @param email User email
 * @param password User password
 * @returns Promise<UserCredential>
 */
export function signUpWithEmail(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

/**
 * Sign in with email and password
 * @param email User email
 * @param password User password
 * @returns Promise<UserCredential>
 */
export function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Sign in with Google
 * @returns Promise<UserCredential>
 */
export function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

/**
 * Sign out current user
 * @returns Promise<void>
 */
export function logOut() {
  return signOut(auth);
}

/**
 * Subscribe to authentication state changes
 * @param callback Function to call when auth state changes
 * @returns Unsubscribe function
 */
export function subscribeToAuthChanges(
  callback: (user: User | null) => void
) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Update user profile
 * @param user User object
 * @param profile Profile data to update
 * @returns Promise<void>
 */
export function updateUserProfile(user: User, profile: { displayName?: string; photoURL?: string }) {
  return updateProfile(user, profile);
}
