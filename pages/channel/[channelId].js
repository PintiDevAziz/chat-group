import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../helpers/firebase";
import MessageItem from "../../components/MessageItem";
import MessageInput from "../../components/MessageInput";
const ChannelId = () => {
  const router = useRouter();
  const { channelId } = router.query;
  const [currentChannel, setCurrentChannel] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState();
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
    <div className="bg-themeGray w-[calc(100vw-18rem)] h-screen overflow-y-auto overflow-x-hidden  ">
      <div className="bg-themeGray sticky shadow-md  w-full px-16  h-14 flex items-center text-white uppercase tracking-widest">
        {currentChannel?.channelMeta.name}
      </div>
      <div className=" overflow-auto h-[calc(100vh-8.5rem)]">
        {loading ? (
          <>Loading</>
        ) : (
          messages.map((message, indeks) => <div>{message.content}</div>)
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
