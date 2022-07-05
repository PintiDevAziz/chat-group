import { collection, onSnapshot } from "firebase/firestore";
import toast from "react-hot-toast";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MdArrowBackIosNew } from "react-icons/md";
import { db } from "../helpers/firebase";
import copy from "copy-to-clipboard";
const SelectedChannel = ({ channel }) => {
  const [members, setMembers] = useState([]);
  useEffect(() => {
    if (channel) {
      console.log(channel);
      onSnapshot(collection(db, "users"), (snap) => {
        setMembers(
          snap.docs
            .map((data) => data.data())
            .filter(function (allUser) {
              return (
                channel.members.filter(function (anotherOne_el) {
                  return anotherOne_el == allUser.id;
                }).length !== 0
              );
            })
        );
      });
    }
  }, [channel]);

  return (
    <div>
      <div className="w-full flex  items-center justify-between mb-6 shadow ">
        <Link href={"/"}>
          <a className="flex items-center gap-x-3">
            <MdArrowBackIosNew />
            <p>All Channels</p>
          </a>
        </Link>
      </div>
      <div className="w-full flex-shrink-0  mb-7">
        <div>
          <h2 className="font-semibold text-xl mb-4">
            {channel?.channelMeta.name}
          </h2>
        </div>
        <p className="break-all ">{channel?.channelMeta.describtion}</p>
      </div>
      <div className="w-full">
        <h2 className="font-semibold text-lg uppercase mb-4">Members</h2>
        <div>
          {members.map((member, key) => (
            <div
              key={key}
              onClick={(e) => {
                copy(member.id);
                toast.success('Id Copied Succesfuly')
              }}
              className="flex cursor-pointer items-center gap-x-4 mb-4 hover:bg-white/20 p-2 rounded-md"
            >
              <img
                src={member.photoUrl}
                className="rounded-full w-12 h-12 object-cover"
              />
              <p className="capitalize cursor-pointer ">{member.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectedChannel;
