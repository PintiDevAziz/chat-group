import React, { useContext, useEffect, useId, useState } from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { useRouter } from "next/router";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../helpers/firebase";
import MessageItem from "../../components/MessageItem";
import MessageInput from "../../components/MessageInput";
import uniqid from "uniqid";
import { AuthContext } from "../../helpers/context/AuthContext";
import AddUserToGroupPopUp from "../../components/AddUserGroupPopUp";
const ChannelId = () => {
  const router = useRouter();
  const { channelId } = router.query;
  const [currentChannel, setCurrentChannel] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState();
  const [addUserModal, setAddUserModal] = useState(false);
  const { user, userLoading } = useContext(AuthContext);
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
  return (
    <div className="bg-themeGray  w-[calc(100vw-18rem)] h-screen overflow-y-auto overflow-x-hidden  ">
      <AddUserToGroupPopUp
        channelPopUp={addUserModal}
        setChannelPopUp={setAddUserModal}
      />
      <div className="bg-themeGray justify-between sticky shadow-md  w-full px-16  h-14 flex items-center text-white uppercase tracking-widest">
        <p>{currentChannel?.channelMeta.name}</p>
        {currentChannel &&
          !userLoading &&
          user.uid == currentChannel.channelMeta.admin && (
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
      <div className="   overflow-auto h-[calc(100vh-8.5rem)] px-10 py-5 flex flex-col gap-y-4 w-[calc(100vw-18rem)]">
        {loading ? (
          <>Loading</>
        ) : (
          messages.map((message, indeks) => (
            <MessageItem key={uniqid()} message={message} />
          ))
        )}
      </div>
      <MessageInput
        messageInput={messageInput}
        setMessageInput={setMessageInput}
        channelId={channelId}
      />
    </div>
  );
};

export default ChannelId;
