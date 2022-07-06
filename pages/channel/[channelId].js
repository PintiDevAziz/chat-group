import React, { useContext, useEffect, useRef, useState } from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { useRouter } from "next/router";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../helpers/firebase";
import MessageItem from "../../components/MessageItem";
import MessageInput from "../../components/MessageInput";
import uniqid from "uniqid";
import { AuthContext } from "../../helpers/context/AuthContext";
import AddUserToGroupPopUp from "../../components/AddUserGroupPopUp";
import Lottie from "lottie-react";
import ClosedAnimation from "../../animations/closed.json";
const ChannelId = () => {
  const router = useRouter();
  const { channelId } = router.query;
  const [currentChannel, setCurrentChannel] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState();
  const [addUserModal, setAddUserModal] = useState(false);
  const { user, userLoading } = useContext(AuthContext);
  const bottom = useRef();
  useEffect(() => {
    if (channelId) {
      setLoading(true);
      const docRef = doc(db, "channels", channelId);
      onSnapshot(docRef, (snap) => {
        setCurrentChannel(snap.data());
      });
    }
  }, [channelId]);
  useEffect(() => {
    if (currentChannel) {
      setLoading(false);
      setMessages(currentChannel.messages);
    }
  }, [currentChannel]);
  useEffect(() => {
    bottom.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);
  return (
    <div className="bg-themeGray  w-[calc(100vw-18rem)] h-screen overflow-y-auto overflow-x-hidden  ">
      <AddUserToGroupPopUp
        channelPopUp={addUserModal}
        setChannelPopUp={setAddUserModal}
      />
      <div className="bg-themeGray justify-between sticky shadow-md  w-full px-16  h-14 flex items-center text-white uppercase tracking-widest">
        <p>{currentChannel?.channelMeta.name}</p>
        {currentChannel &&
          user &&
          user?.uid == currentChannel?.channelMeta.admin.id && (
            <button
              onClick={() => {
                setAddUserModal(true);
              }}
              className="flex text-lg group items-center gap-x-2 text-gray-400 hover:text-white"
            >
              <p>Add User</p>
              <AiOutlineUserAdd />
            </button>
          )}
      </div>
      <div className="   hover:overflow-auto overflow-hidden  h-[calc(100vh-8.5rem)] px-10 py-5 flex flex-col gap-y-4 w-[calc(100vw-18rem)]">
        {loading ? (
          <>Loading</>
        ) : currentChannel && currentChannel.members.includes(user.uid) ? (
          messages.map((message) => (
            <MessageItem key={uniqid()} message={message} />
          ))
        ) : (
          <div className="w-full h-full flex items-center justify-center flex-col">
            <Lottie
              animationData={ClosedAnimation}
              loop={true}
              className="w-[30rem]"
            />
            <h2 className="capitalize text-white text-3xl font-semibold">
              You are not member of this group
            </h2>
          </div>
        )}
        <div ref={bottom}></div>
      </div>
      {currentChannel && currentChannel.members.includes(user.uid) && (
        <MessageInput
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          channelId={channelId}
        />
      )}
    </div>
  );
};

export default ChannelId;
