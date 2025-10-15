import React from "react";

const Spinner: React.FC<{ size?: string; color?: string }> = ({
  size = "w-8 h-8",
  color = "border-blue-500",
}) => {
  return (
    <div className={`flex justify-center items-center`}>
      <div
        className={`animate-spin ${size} border-4 border-t-transparent border-solid rounded-full ${color}`}
      ></div>
    </div>
  );
};

export default Spinner;