import { doc, onSnapshot, setDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { db } from "../helpers/firebase";
import { AuthContext } from "../helpers/context/AuthContext";
const MessageInput = ({ messageInput, setMessageInput, channelId }) => {
  const { user } = useContext(AuthContext);

  const [allMessages, setAllMessages] = useState();

  useEffect(() => {
    if (channelId) {
      const docRef = doc(db, "channels", channelId);
      onSnapshot(docRef, (snap) => {
        setAllMessages(snap.data().messages);
      });
    }
  }, [channelId]);
  const sendMessage = async () => {
    const date = new Date();

    if (messageInput) {
      const docRef = doc(db, "channels", channelId);
      await onSnapshot(docRef, (snap) => {
        setAllMessages(snap.data().messages);
      });
      setMessageInput("");

      if (allMessages) {
        await setDoc(
          docRef,
          {
            messages: [
              ...allMessages,
              {
                sendedBy: {
                  name: user.displayName,
                  avatar: user.photoURL,
                  id: user.uid,
                },
                content: messageInput,
                sendedAt: date.toISOString(),
              },
            ],
          },
          { merge: true }
        );
      }
    }
  };
  return (
    <div className="w-full p-4 flex items-center relative">
      <input
        className="bg-[#3c393f] text-white rounded outline-none peer px-4  w-full h-12"
        type="text"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        name="message"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }}
        placeholder="Type a Message Here"
      />
      <button
        onClick={sendMessage}
        disabled={messageInput ? false : true}
        className="rounded-md disabled:opacity-60 disabled:cursor-not-allowed hover:bg-themeBlue/70 flex-shrink-0 absolute w-10 h-10  left-[calc(100%-4rem)] bg-themeBlue text-white flex items-center justify-center"
      >
        <IoMdSend />
      </button>
    </div>
  );
};

export default MessageInput;
