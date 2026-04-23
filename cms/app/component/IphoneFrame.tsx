import React, { ReactNode } from "react";

interface IphoneFrameProps {
  children: ReactNode;
  className?: string;
}

const IphoneFrame: React.FC<IphoneFrameProps> = ({ children, className = "" }) => {
  return (
    <div className={`relative ${className} w-[306px]`}>
      {/* Outer frame with metallic edge effect */}
      <div className="relative bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 rounded-[55px] p-[3px] shadow-2xl">
        {/* Inner phone body */}
        <div className="relative bg-zinc-950 rounded-[52px] p-[10px]">
          
          {/* Left side buttons */}
          <div className="absolute left-[-3px] top-[100px] w-[3px] h-[30px] bg-zinc-700 rounded-l-sm" />
          <div className="absolute left-[-3px] top-[145px] w-[3px] h-[55px] bg-zinc-700 rounded-l-sm" />
          <div className="absolute left-[-3px] top-[210px] w-[3px] h-[55px] bg-zinc-700 rounded-l-sm" />
          
          {/* Right side button */}
          <div className="absolute right-[-3px] top-[160px] w-[3px] h-[80px] bg-zinc-700 rounded-r-sm" />
          
          {/* Screen container */}
          <div className="relative bg-white rounded-[42px] w-[280px] h-[600px] overflow-hidden">
            
            {/* Status bar */}
            <div className="absolute top-0 left-0 right-0 h-12 z-10 flex items-center justify-between px-6 pt-1">
              <span className="text-xs font-semibold text-zinc-900">9:41</span>
              <div className="flex items-center gap-1">
                {/* Signal */}
                <div className="flex items-end gap-[2px] h-3">
                  <div className="w-[3px] h-[4px] bg-zinc-900 rounded-sm" />
                  <div className="w-[3px] h-[6px] bg-zinc-900 rounded-sm" />
                  <div className="w-[3px] h-[8px] bg-zinc-900 rounded-sm" />
                  <div className="w-[3px] h-[10px] bg-zinc-900 rounded-sm" />
                </div>
                {/* WiFi */}
                <svg className="w-4 h-4 text-zinc-900 ml-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 18c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0-4c2.8 0 5.3 1.1 7.2 3l-1.4 1.4C16.2 16.9 14.2 16 12 16s-4.2.9-5.8 2.4L4.8 17c1.9-1.9 4.4-3 7.2-3zm0-4c4 0 7.6 1.6 10.3 4.2l-1.4 1.4C18.5 13.2 15.4 12 12 12s-6.5 1.2-8.9 3.6l-1.4-1.4C4.4 11.6 8 10 12 10zm0-4c5.2 0 9.9 2.1 13.4 5.5l-1.4 1.4C21 10.2 16.7 8 12 8S3 10.2.1 12.9l-1.5-1.4C2.1 8.1 6.8 6 12 6z"/>
                </svg>
                {/* Battery */}
                <div className="flex items-center ml-1">
                  <div className="w-6 h-3 border border-zinc-900 rounded-sm relative">
                    <div className="absolute inset-[2px] right-[3px] bg-zinc-900 rounded-sm" />
                  </div>
                  <div className="w-[2px] h-[4px] bg-zinc-900 rounded-r-sm" />
                </div>
              </div>
            </div>
            
            {/* Screen content */}
            <div className="h-full pt-12 pb-6 overflow-hidden">
              {children}
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle reflection */}
      <div className="absolute inset-0 rounded-[55px] bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

export default IphoneFrame;
