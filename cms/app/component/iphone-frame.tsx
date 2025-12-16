import React, { ReactNode } from "react";

interface IphoneFrameProps {
  children: ReactNode;
  className?: string;
}

const IphoneFrame: React.FC<IphoneFrameProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`relative bg-black rounded-3xl p-2 w-[360px] h-[720px] shadow-xl ${className}`}
    >
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[210px] h-6 bg-black rounded-b-xl"></div>

      <div className="bg-white rounded-2xl w-full h-full overflow-hidden p-4">
        {children}
      </div>
    </div>
  );
};

export default IphoneFrame;