import React, { ReactNode } from "react";

interface IphoneFrameProps {
  children: ReactNode;
  className?: string;
}

const IphoneFrame: React.FC<IphoneFrameProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`relative bg-black rounded-[50px] p-2 w-[360px] h-[720px] shadow-xl ${className}`}
    >
      <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-[100px] h-6 bg-black rounded-full"></div>

      <div className="bg-white rounded-[44px] w-full h-full overflow-hidden p-4 pt-20">
        {children}
      </div>
    </div>
  );
};

export default IphoneFrame;