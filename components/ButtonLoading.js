import React from "react";

const ButtonLoading = () => {
  return (
    <>
      <div className=" ease-linear  animate-pulse animate-bounce ">.</div>
      <div className=" ease-linear  animate-pulse animate-bounce [animation-delay:200ms]">
        .
      </div>
      <div className=" ease-linear  animate-pulse animate-bounce [animation-delay:300ms]">
        .
      </div>
    </>
  );
};

export default ButtonLoading;
