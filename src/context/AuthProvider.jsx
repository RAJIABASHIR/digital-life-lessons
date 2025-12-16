import { useEffect, useState, useCallback } from "react";
import app from "../firebase/firebase.config";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
} from "firebase/auth";
import axiosInstance from "../utils/axiosInstance";
import AuthContext from "./AuthContext";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export default function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [appUser, setAppUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const registerEmailPassword = async ({ name, email, password, photoURL }) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    if (name || photoURL) {
      await updateProfile(cred.user, {
        displayName: name,
        photoURL: photoURL || "",
      });
    }

    return cred.user;
  };

  const loginEmailPassword = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);

  const logout = () => signOut(auth);

  const fetchAppUser = useCallback(async (userArg) => {
    try {
      const user = userArg || auth.currentUser;
      if (!user) {
        setAppUser(null);
        return;
      }

      const token = await user.getIdToken();
      const res = await axiosInstance.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAppUser(res.data);
    } catch (err) {
      console.error("Failed to load app user", err);
      setAppUser(null);
    }
  }, []);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);

      if (user) {
        try {
          await fetchAppUser(user);
        } finally {
          setLoading(false);
        }
      } else {
        setAppUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [fetchAppUser]);

  const value = {
    firebaseUser,
    appUser,
    loading,
    isLoggedIn: !!firebaseUser,
    isPremium: !!appUser?.isPremium,
    isAdmin: appUser?.role === "admin",
    registerEmailPassword,
    loginEmailPassword,
    loginWithGoogle,
    logout,
    refetchAppUser: fetchAppUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}