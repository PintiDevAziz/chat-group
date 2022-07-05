import React, { useContext, useEffect, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import ErrorText from "../components/ErrorText";
import { AiOutlineClose } from "react-icons/ai";
import { arrayUnion, doc, setDoc } from "firebase/firestore";
import { db } from "../helpers/firebase";
import { AuthContext } from "../helpers/context/AuthContext";
import ButtonLoading from "../components/ButtonLoading";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
const AddUserToGroupPopUp = ({ channelPopUp, setChannelPopUp }) => {
  const [loading, setLoading] = useState(false);
  const [errorAnimate] = useAutoAnimate({
    duration: 300,
    easing: "linear",
  });
  const [idInput, setIdInput] = useState("");
  const [idInputError, setIdInputError] = useState(null);
  const router = useRouter();
  const addUserToGroup = async () => {
    if (!idInputError) {
      setLoading(true);
      const docRef = doc(db, "channels", router.query.channelId);
      await setDoc(
        docRef,
        {
          members: arrayUnion(idInput),
        },
        { merge: true }
      )
        .then((d) => {
          setLoading(false);
          setIdInput("");
          setChannelPopUp(false);
        })
        .catch((err) => setIdInputError(err.code));
    }
    toast.success("User Added Succesfuly");
  };
  useEffect(() => {
    if (idInput.length < 28) {
      setIdInputError("User id has to be 28 digit");
    }
    return () => {
      setIdInputError(null);
    };
  }, [idInput]);

  return (
    <div
      className={`absolute z-[99999] bg-themeBlack/70 w-full h-full top-0 left-0 flex items-center justify-center ${
        channelPopUp ? "scale-100" : "scale-0"
      } transition-transform`}
    >
      <button
        onClick={() => {
          setChannelPopUp(false);
        }}
        className="text-gray-400 text-3xl hover:text-white absolute top-5 right-5"
      >
        <AiOutlineClose />
      </button>
      <div className="bg-themeBlack text-white p-6 w-[35rem]  rounded-lg">
        <h2 className=" uppercase font-semibold  tracking-widest mb-5">
          Add New Member
        </h2>
        <input
          type="text"
          value={idInput}
          onChange={(e) => {
            setIdInput(e.target.value);
          }}
          placeholder="User Id"
          className="bg-[#3c393f] w-full h-10 rounded-md px-4 outline-none mb-5"
        />
        <div className="w-full flex mt-2" ref={errorAnimate}>
          {idInputError ? <ErrorText error={idInputError} /> : null}
        </div>
        <button
          disabled={idInputError ? true : false}
          onClick={addUserToGroup}
          className="bg-themeBlue disabled:opacity-60 disabled:cursor-not-allowed hover:bg-themeBlue/70 transition-all flex items-center justify-center rounded-md mt-5  w-44   h-10  ml-[calc(100%-11rem)]"
        >
          {loading ? (
            <div className="flex items-center  justify-center gap-x-2">
              <p>User Adding</p>
              <ButtonLoading />
            </div>
          ) : (
            "Add User"
          )}
        </button>
      </div>
    </div>
  );
};

export default AddUserToGroupPopUp;
