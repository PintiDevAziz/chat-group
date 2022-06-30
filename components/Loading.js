import React from "react";
import Lottie from "lottie-react";
import LoadingAnimation from "../animations/loading.json";
const Loading = ({ size }) => {
  return (
    <div
      style={{ height: `${size}px`, width: `${size}` }}
      className="flex items-center justify-center"
    >
      <Lottie loop={true} animationData={LoadingAnimation} size={size} />
    </div>
  );
};

export default Loading;
