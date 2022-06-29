import React from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import ErrorText from "../../components/ErrorText";
import { AuthContext } from "../../helpers/context/AuthContext";
import { useRouter } from "next/dist/client/router";
import { auth, storage } from "../../helpers/firebase";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import Link from "next/link";
import { useAutoAnimate } from "@formkit/auto-animate/react";
const Register = () => {
  const {
    handleRegister,
    registerError,
    setRegisterError,
    user,
    avatar,
    setAvatar,
    registerLoading,
  } = useContext(AuthContext);
  const router = useRouter();
  useEffect(() => {
    if (user !== null) {
      router.push("/");
    }
  }, [user]);
  const [eyeAnimate] = useAutoAnimate({
    duration: 200,
    easing: "linear",
  });
  const [eye, setEye] = useState(false);
  const emailValidator = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userName: "",
  });

  useEffect(() => {
    if (
      formData.email.match(emailValidator) &&
      formData.password.length > 6 &&
      avatar
    ) {
      setRegisterError(null);
    }
    return () => {
      setRegisterError("Please fill the form");
    };
  }, [formData, avatar]);
  const handleAvatarUpload = (e) => {
    if (e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  return (
    <div className="w-full h-screen bg-themeGray flex items-center justify-center">
      <div className="rounded bg-themeBlack  font-mono flex flex-col p-6 text-white">
        <h2 className="text-2xl tracking-wider mb-6  w-[25rem]">
          Create Your Account
        </h2>
        <div className="flex flex-col gap-y-4">
          <label className="relative flex items-center">
            <input
              type="text"
              value={formData.userName}
              onChange={(e) =>
                setFormData({
                  email: formData.email,
                  password: formData.password,
                  userName: e.target.value,
                })
              }
              className=" bg-transparent outline-none border-2  rounded border-gray-500 h-12 w-full px-2"
              placeholder="UserName"
            />
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({
                email: e.target.value,
                password: formData.password,
                userName: formData.userName,
              })
            }
            className=" bg-transparent outline-none border-2  rounded border-gray-500 h-12 w-full px-2"
            placeholder="Email"
          />
          <label className="relative flex items-center">
            <input
              type={eye ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  email: formData.email,
                  password: e.target.value,
                  userName: formData.userName,
                })
              }
              className=" bg-transparent outline-none border-2  rounded border-gray-500 h-12 w-full px-2"
              placeholder="Password"
            />
            <button
              onClick={() => setEye(!eye)}
              ref={eyeAnimate}
              className="absolute right-2 text-lg"
            >
              {eye ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </label>

          <div className="flex items-center justify-between">
            <label
              htmlFor={"imageInput"}
              onClick={() => {
                if (avatar) {
                  setAvatar(null);
                }
              }}
              className={`${
                avatar ? "bg-red-500" : "bg-themeBlue"
              } cursor-pointer w-36 rounded h-10 flex items-center justify-center`}
            >
              {avatar ? "Remove Avatar" : " Upload Avatar"}
            </label>
            <input
              type="file"
              onChange={handleAvatarUpload}
              id="imageInput"
              accept="image/*"
              className="hidden"
            />
            <div>{avatar ? avatar.name : "Please Select Image"}</div>
          </div>
          <ErrorText error={registerError} />
          <button
            onClick={(e) =>
              handleRegister(
                formData.email,
                formData.password,
                formData.userName,
              )
            }
            disabled={registerError ? true : false}
            className="ml-full  w-full mx-auto rounded disabled:opacity-60 disabled:cursor-not-allowed bg-themeBlue h-10"
          >
            {registerLoading ? "Loading" : "Register"}
          </button>
        </div>
        <div className="flex items-center justify-between w-full mt-5 ">
          <Link href="/user/login">
            <a className="hover:underline decoration-themeBlue underline-offset-4">Already Have Account</a>
          </Link>
          <Link href="/user/reset-password">
            <a className="hover:underline decoration-themeBlue underline-offset-4">Reset Password</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
