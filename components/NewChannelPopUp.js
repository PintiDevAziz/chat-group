import React, { useContext, useEffect, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import ErrorText from "../components/ErrorText";
import { AiOutlineClose } from "react-icons/ai";
import { arrayUnion, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../helpers/firebase";
import uniqid from "uniqid/index";
import { AuthContext } from "../helpers/context/AuthContext";
import ButtonLoading from "../components/ButtonLoading";
const NewChannelPopUp = ({ channelPopUp, setChannelPopUp }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [errorAnimate] = useAutoAnimate({
    duration: 300,
    easing: "linear",
  });
  const [channelInfo, setChannelInfo] = useState({
    channelName: "",
    channelBio: "",
  });
  const [channelInfoError, setchannelInfoError] = useState(null);
  const handleCreateChannel = async () => {
    await setLoading(true);
    let id = uniqid();
    const docRef = doc(db, "channels", id);
    if (user) {
      await setDoc(docRef, {
        channelMeta: {
          admin: user.uid,
          id: id,
          describtion: channelInfo.channelBio,
          name: channelInfo.channelName,
          createdAt: new serverTimestamp(),
        },
        members: arrayUnion(user.email),
        messages: {},
      });
    }
    await setLoading(false);
    await setChannelPopUp(false);
    setChannelInfo({
      channelName: "",
      channelBio: "",
    });
  };
  useEffect(() => {
    if (!channelInfo.channelName) {
      setchannelInfoError("You have to use a name for channel");
    }
    return () => {
      setchannelInfoError(null);
    };
  }, [channelInfo.channelName]);

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
          New Channel
        </h2>
        <input
          type="text"
          value={channelInfo.channelName}
          onChange={(e) => {
            setChannelInfo({
              channelBio: channelInfo.channelBio,
              channelName: e.target.value,
            });
          }}
          placeholder="Channel Name"
          className="bg-[#3c393f] w-full h-10 rounded-md px-4 outline-none mb-5"
        />
        <textarea
          type="text"
          value={channelInfo.channelBio}
          onChange={(e) => {
            setChannelInfo({
              channelBio: e.target.value,
              channelName: channelInfo.channelName,
            });
          }}
          placeholder="Channel Description (Optional)"
          className="bg-[#3c393f] resize-none w-full h-20 pt-2 rounded-md px-4 outline-none"
        />
        <div className="w-full flex mt-2" ref={errorAnimate}>
          {channelInfoError ? <ErrorText error={channelInfoError} /> : null}
        </div>
        <button
          disabled={channelInfoError ? true : false}
          onClick={handleCreateChannel}
          className="bg-themeBlue disabled:opacity-60 disabled:cursor-not-allowed hover:bg-themeBlue/70 transition-all flex items-center justify-center rounded-md mt-5  w-32 h-10  ml-[calc(100%-8rem)]"
        >
          {loading ? (
            <div className="flex items-center  justify-center gap-x-2">
              <p>Loading</p>
              <ButtonLoading />
            </div>
          ) : (
            "Save"
          )}
        </button>
      </div>
    </div>
  );
};

export default NewChannelPopUp;
