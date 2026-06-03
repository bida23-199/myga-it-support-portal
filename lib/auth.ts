import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";

import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export async function registerUser(
  fullName: string,
  username: string,
  email: string,
  password: string,
  role: string
) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    fullName,
    username,
    email,
    role,
    createdAt: Date.now(),
  });

  return user;
}

export async function loginUser(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;

  const userDoc = await getDoc(doc(db, "users", user.uid));

  if (!userDoc.exists()) {
    throw new Error("User profile not found.");
  }

  const userData: any = userDoc.data();

  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("uid", user.uid);
  localStorage.setItem("username", userData.username);
  localStorage.setItem("fullName", userData.fullName);
  localStorage.setItem("email", userData.email);
  localStorage.setItem("role", userData.role);

  return userData;
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}

export function isLoggedIn() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("isLoggedIn") === "true";
}

export function getUserRole() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("role") || "";
}

export function getUsername() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("username") || "";
}

export function getFullName() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("fullName") || "";
}

export function getUserEmail() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("email") || "";
}

export async function logoutUser() {
  await signOut(auth);

  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("uid");
  localStorage.removeItem("username");
  localStorage.removeItem("fullName");
  localStorage.removeItem("email");
  localStorage.removeItem("role");

  window.location.replace("/login");
}