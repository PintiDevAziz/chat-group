import React from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import ErrorText from "../../components/ErrorText";
import { AuthContext } from "../../helpers/context/AuthContext";
import { useRouter } from "next/dist/client/router";
import { auth } from "../../helpers/firebase";
import Link from "next/link";
const Login = () => {
  const { handleLogin, loginError, setLoginError, user } =
    useContext(AuthContext);
  const router = useRouter();
  useEffect(() => {
    if (user !== null) {
      router.push("/");
    }
  }, [user]);

  const emailValidator = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (formData.email.match(emailValidator) && formData.password.length > 6) {
      setLoginError(null);
    }
    return () => {
      setLoginError("Please fill the form");
    };
  }, [formData]);

  return (
    <div className="w-full h-screen bg-themeGray flex items-center justify-center">
      <div className="rounded bg-themeBlack  font-mono flex flex-col p-6 text-white">
        <h2 className="text-2xl tracking-wider mb-6  w-[25rem]">
          Login Your Account
        </h2>
        <div className="flex flex-col gap-y-4">
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({
                email: e.target.value,
                password: formData.password,
              })
            }
            className=" bg-transparent outline-none border-2  rounded border-gray-500 h-12 w-full px-2"
            placeholder="Email"
          />
          <label className="relative flex items-center">
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  email: formData.email,
                  password: e.target.value,
                })
              }
              className=" bg-transparent outline-none border-2  rounded border-gray-500 h-12 w-full px-2"
              placeholder="Password"
            />
          </label>
          <ErrorText error={loginError} />
          <button
            onClick={(e) =>
              handleLogin(formData.email, formData.password, e)
            }
            disabled={loginError ? true : false}
            className="ml-full mx-auto  w-full rounded disabled:opacity-60 disabled:cursor-not-allowed bg-themeBlue h-10"
          >
            Login
          </button>
        </div>
        <div className="flex items-center justify-between w-full mt-5 ">
          <Link href="/user/register">
            <a className="hover:underline decoration-themeBlue underline-offset-4">
              Create Account
            </a>
          </Link>
          <Link href="/user/reset-password">
            <a className="hover:underline decoration-themeBlue underline-offset-4">
              Reset Password
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
