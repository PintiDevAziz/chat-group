import React from "react";

const ErrorText = ({ error }) => {
  return <div className="text-red-500 mx-auto tracking-wide">{error}</div>;
};

export default ErrorText;
