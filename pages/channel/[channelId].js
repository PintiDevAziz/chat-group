import React from "react";
import { useRouter } from "next/router";
const ChannelId = () => {
  const router = useRouter();
  const { channelId } = router.query;
  return <div>{channelId}</div>;
};

export default ChannelId;
