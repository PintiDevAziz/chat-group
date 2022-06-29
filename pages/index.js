import { onAuthStateChanged, signOut } from "firebase/auth";
import Router from "next/router";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../helpers/context/AuthContext";
import { auth } from "../helpers/firebase";

const Index = () => {
  const { user, setUser, userLoading } = useContext(AuthContext);
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!userLoading) {
        console.log(user);
      }
    });
  }, [userLoading]);
  return (
    <div>
      <button
        onClick={() => {
          signOut(auth);
        }}
      >
        Log Out {user?.email}
      </button>
    </div>
  );
};

export default Index;
