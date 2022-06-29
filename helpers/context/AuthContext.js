import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase";
export const AuthContext = createContext();
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [loginError, setLoginError] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [resetSucces, setResetSucces] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [resetPasswordError, setResetPasswordError] = useState(null);
  const handleLogin = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password)
      .then((user) => setLoginError(null))
      .catch((err) => setLoginError(err.code.replace("auth/", "")));
  };

  const handleRegister = async (email, password, userName) => {
    setRegisterLoading(true);
    const storageRef = ref(
      storage,
      `gs://chat-group-7c45c.appspot.com/userAvatars/${userName}-avatar`
    );
    uploadBytes(storageRef, avatar).then((data) => {
      const avatarRef = ref(storage, data.ref.fullPath);
      getDownloadURL(avatarRef).then((img) => {
        createUserWithEmailAndPassword(auth, email, password)
          .then((user) => {
            updateProfile(user.user, {
              photoURL: img,
              displayName: userName,
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
  const handleResetPassword = (email) => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setRegisterError(null);
        setResetSucces(true);
      })
      .catch((err) => setRegisterError(err.code.replace("auth/", "")));
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
  };
  return (
    <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
  );
};
