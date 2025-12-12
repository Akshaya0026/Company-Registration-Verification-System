import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  sendEmailVerification,
  onAuthStateChanged
} from "firebase/auth";

export const signup = async (email, password) => {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(userCred.user);
  return userCred.user;
};

export const login = async (email, password) => {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  return userCred.user;
};

export const logout = async () => {
  await fbSignOut(auth);
};

export const onAuthChanged = (cb) => onAuthStateChanged(auth, cb);
