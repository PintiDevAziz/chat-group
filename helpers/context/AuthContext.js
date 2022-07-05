import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
export const AuthContext = createContext();
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [loginError, setLoginError] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [resetSucces, setResetSucces] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [resetPasswordError, setResetPasswordError] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setUserLoading(false);
      } else {
        setUserLoading(true);
      }
      return () => unsub;
    });
  }, []);
  const handleLogin = async (email, password) => {
    setLoginLoading(true);
    await signInWithEmailAndPassword(auth, email, password)
      .then((user) => setLoginError(null))
      .catch((err) => {
        setLoginError(err.code.replace("auth/", ""));
        setLoginLoading(false);
      });
  };

  const handleRegister = async (email, password, userName) => {
    setRegisterLoading(true);
    const storageRef = ref(
      storage,
      `gs://chat-group-7c45c.appspot.com/userAvatars/${email}-avatar`
    );
    uploadBytes(storageRef, avatar).then((data) => {
      const avatarRef = ref(storage, data.ref.fullPath);
      getDownloadURL(avatarRef).then((img) => {
        createUserWithEmailAndPassword(auth, email, password)
          .then(async (user) => {
            await updateProfile(user.user, {
              photoURL: img,
              displayName: userName,
            });
            await setDoc(doc(db, "users", user.user.uid), {
              name: user.user.displayName,
              email: user.user.email,
              photoUrl: user.user.photoURL,
              id: user.user.uid,
            });
            setRegisterError(null);
            setRegisterLoading(false);
          })
          .catch((err) => {
            setRegisterError(err.code.replace("auth/", ""));
            setRegisterLoading(false);
          });
      });
    });
    {
    }
  };

  const handleResetPassword = (email) => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setRegisterError(null);
        setResetSucces(true);
      })
      .catch((err) => setResetPasswordError(err.code.replace("auth/", "")));
  };
  const authData = {
    handleLogin,
    loginError,
    setLoginError,
    user,
    setUser,
    resetPasswordError,
    setResetPasswordError,
    userLoading,
    registerError,
    setRegisterError,
    handleResetPassword,
    handleRegister,
    avatar,
    setAvatar,
    registerLoading,
    resetSucces,
    setResetSucces,
    loginLoading
  };
  return (
    <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
  );
};
