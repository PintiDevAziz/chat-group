import React, { useContext, useEffect } from "react";
import { AuthContext } from "../helpers/context/AuthContext";
import Lottie from "lottie-react";
import welcomeAnimation from "../animations/welcome.json";
import Link from "next/link";
import toast from "react-hot-toast";
const Index = () => {
  const { user } = useContext(AuthContext);
  useEffect(() => {
    if (user) {
      toast.success("Logined Succesfuly");
    } else {
      toast.error("Log out");
    }
    return () => null;
  }, [user]);
  return (
    <>
      {!user ? (
        <div className="absolute flex px-24 gap-x-10 items-center w-full h-full bg-themeGray top-0 left-0">
          <div className="w-1/2 flex items-center justify-center">
            <Lottie animationData={welcomeAnimation} />
          </div>
          <div className="w-1/2 flex items-center gap-y-5 flex-col justify-center">
            <h2 className="text-5xl font-semibold text-white tracking-wider">
              Welcome To Group Chat
            </h2>
            <p className="text-gray-400 text-lg tracking-wider">
              Let's get started
            </p>
            <Link href={"/user/login"}>
              <a className="w-full h-12 flex items-center justify-center text-lg hover:bg-themeBlue/80  transition-colors tracking-widest rounded-md text-white bg-themeBlue">
                I have an account
              </a>
            </Link>
            <Link href={"/user/register"}>
              <a className="w-full h-12 flex items-center justify-center text-lg hover:bg-themeBlue/80  transition-colors tracking-widest rounded-md text-white bg-themeBlue">
                I am new at here
              </a>
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Index;
