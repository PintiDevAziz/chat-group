import React from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { AuthContext } from "../../helpers/context/AuthContext";
import { useRouter } from "next/dist/client/router";
import ErrorText from "../../components/ErrorText";
import Link from "next/link";
import Lottie from "lottie-react";
import mailAnimation from "../../animations/mail.json";
const Login = () => {
  const emailValidator = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  const [email, setEmail] = useState("");
  const [showAnimation, setShowAnimation] = useState(true);
  const {
    handleResetPassword,
    resetPasswordError,
    setResetPasswordError,
    resetSucces,
    user
  } = useContext(AuthContext);
  useEffect(() => {
    if (email.match(emailValidator)) {
      setResetPasswordError(null);
    }
    return () => {
      setResetPasswordError("Please fill the form");
    };
  }, [email]);
  console.log(showAnimation);
  const [animation] = useAutoAnimate();
  const router = useRouter()
  useEffect(() => {
    if (user !== null) {
      router.push("/");
    }
  }, [user]);
  return (
    <div
      ref={animation}
      className="w-full h-screen bg-themeGray flex items-center justify-center"
    >
      {resetSucces ? (
        <div className="rounded bg-themeBlack  font-mono flex flex-col p-6 text-white w-[35rem]">
          {showAnimation ? (
            <div className="w-[35rem] flex items-center justify-center h-full">
              <Lottie animationData={mailAnimation} loop={false} />
            </div>
          ) : (
            <>
              <h2 className="text-2xl tracking-wider mb-6  w-[25rem]">
                Reset Your Password
              </h2>
              <p className="text-center">
                We send an email that contains a link for reseting your account
                password
              </p>
              <Link href={"/user/login"}>
                <a className=" flex items-center w-full h-10 justify-center mt-4 bg-themeBlue hover:bg-themeBlue/80">
                  Back to the Login
                </a>
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="rounded bg-themeBlack  font-mono flex flex-col p-6 text-white">
          <h2 className="text-2xl tracking-wider mb-6  w-[25rem]">
            Reset Your Password
          </h2>
          <div className="flex flex-col gap-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className=" bg-transparent outline-none border-2  rounded border-gray-500 h-12 w-full px-2"
              placeholder="Email"
            />
            <ErrorText error={resetPasswordError} />
            <button
              onClick={() => {
                handleResetPassword(email);
                setTimeout(() => {
                  setShowAnimation(false);
                }, [2000]);
              }}
              className="ml-full mx-auto  w-full rounded disabled:opacity-60 disabled:cursor-not-allowed bg-themeBlue h-10"
            >
              Send Email
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
