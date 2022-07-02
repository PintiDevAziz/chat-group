import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const ChannelItem = ({ channel }) => { 
  const router = useRouter()
  console.log(channel.channelMeta.id)
  console.log(router.query.channelId)
  return (
    <Link href={`/channel/${channel.channelMeta.id}`}>
      <a  className={`w-full  transition-all hover:bg-white/10 p-2 rounded-md cursor-pointer flex items-center  uppercase  tracking-wider gap-x-4`}>
        <div className="bg-themeGray rounded-md  p-2 w-10 h-10 flex items-center justify-center">
          {channel.channelMeta.name.slice(0, 1)}
        </div>
        <div>{channel.channelMeta.name}</div>
      </a>
    </Link>
  );
};

export default ChannelItem;
