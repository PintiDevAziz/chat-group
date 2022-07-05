import React from "react";
import Lottie from "lottie-react";
import LoadingAnimation from "../animations/loading.json";
const Loading = ({ size }) => {
  return (
    <div className="flex items-center justify-center  ">
      <Lottie
        loop={true}
        animationData={LoadingAnimation}
        style={{ width: size + "px", height: size + "px" }}
      />
    </div>
  );
};

export default Loading;
