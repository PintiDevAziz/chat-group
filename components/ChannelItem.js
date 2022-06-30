import Link from "next/link";
import React from "react";

const ChannelItem = ({ channelMeta }) => {
  return (
    <Link href={`/channel/${channelMeta.id}`}>
      <a className="w-full transition-all hover:bg-white/10 p-2 rounded-md cursor-pointer flex items-center  uppercase  tracking-wider gap-x-4">
        <div className="bg-themeGray rounded-md  p-2 w-10 h-10 flex items-center justify-center">
          {channelMeta.name.slice(0, 1)}
        </div>
        <div>{channelMeta.name}</div>
      </a>
    </Link>
  );
};

export default ChannelItem;
