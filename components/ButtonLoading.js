import React from "react";

const ButtonLoading = () => {
  return (
    <div className="flex items-center">
      <div className=" ease-linear  animate-pulse animate-bounce ">.</div>
      <div className=" ease-linear  animate-pulse animate-bounce [animation-delay:200ms]">
        .
      </div>
      <div className=" ease-linear  animate-pulse animate-bounce [animation-delay:300ms]">
        .
      </div>
    </div>
  );
};

export default ButtonLoading;
