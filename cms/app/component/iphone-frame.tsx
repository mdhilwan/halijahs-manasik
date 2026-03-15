import React, { ReactNode } from "react";

interface IphoneFrameProps {
  children: ReactNode;
  className?: string;
}

const IphoneFrame: React.FC<IphoneFrameProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`relative bg-foreground rounded-[50px] p-2 w-[320px] h-[680px] shadow-xl ${className}`}
    >
      {/* Notch */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-[90px] h-6 bg-foreground rounded-full z-10"></div>

      {/* Screen */}
      <div className="bg-card rounded-[44px] w-full h-full overflow-hidden p-4 pt-14">
        {children}
      </div>
    </div>
  );
};

export default IphoneFrame;
