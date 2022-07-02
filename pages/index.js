import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Router, { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { AiOutlineUsergroupDelete } from "react-icons/ai";
import { AuthContext } from "../helpers/context/AuthContext";
import { auth, db } from "../helpers/firebase";

const Index = () => {
  const { user, setUser, userLoading } = useContext(AuthContext);
  const router = useRouter();
  return (
    <div>
      <button
        onClick={() => {
          signOut(auth);
          setUser(null);
        }}
      >
        Log Out {user?.email}
      </button>
    </div>
  );
};

export default Index;
