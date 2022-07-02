import React, { useContext } from "react";
import moment from "moment";
import "moment/locale/az";
import { AuthContext } from "../helpers/context/AuthContext";
const MessageItem = ({ message }) => {
  const { user } = useContext(AuthContext);
  return (
    <div
      className={`${
        user.uid == message.sendedBy.id ? "justify-end" : "justify-start"
      } flex  flex-shrink-0  `}
    >
      <div
        className={`flex gap-x-3  items-center  flex-shrink-0 ${
          user.uid === message.sendedBy.id && "flex-row-reverse"
        }`}
      >
        <img
          src={message.sendedBy.avatar}
          className="rounded-full w-12 flex-shrink-0 h-12 object-cover"
        />
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2 ">
            <div className="text-gray-400 capitalize  flex-shrink-0">
              {message.sendedBy.name}
            </div>
            <div className="text-sm text-gray-500  w-full  ">
              {moment(message.sendedAt).format("hh:mm:ss")}
            </div>
          </div>
          <div className="text-white ml-full ">{message.content}</div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
