"use client";
import React, { useEffect, useRef, useState } from "react";
import { PreviewData } from "../lib/serializeForPostMessage";
import IphoneFrame from "./IphoneFrame";

interface PreviewFrameProps {
  data: PreviewData | null;
  duaId?: number; // Optional: ID of dua to focus on in preview
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({ data, duaId }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isIframeReady, setIsIframeReady] = useState(false);

  // Handle iframe load event
  const handleIframeLoad = () => {
    console.log('Preview Frame ready!')
    setIsIframeReady(true);
  };

  // Send postMessage only when iframe is ready and data is available
  useEffect(() => {
    if (!data || !isIframeReady || !iframeRef.current?.contentWindow) return;

    // Send data to iframe via postMessage
    console.log("Sending MANASIK_DATA_UPDATE to")
    setTimeout(() => {
      iframeRef.current.contentWindow.postMessage(
        {
          type: "MANASIK_DATA_UPDATE",
          payload: {
            ...data,
            selectedDuaId: duaId, // Include the dua id to focus on
          },
        },
        "*" // In production, use specific origin like "http://localhost:8081"
      );
    }, 1000)
  }, [data, duaId, isIframeReady]);

  const SCALE = 0.65;
  const ORIGINAL_WIDTH = 446;
  const ORIGINAL_HEIGHT = 842;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4 rounded-lg">
      {/* iPhone Frame with Scaled Iframe */}
      <IphoneFrame>
        {/* Scaled iframe wrapper */}
        <div
          style={{
            width: `${ORIGINAL_WIDTH}px`,
            height: `${ORIGINAL_HEIGHT}px`,
            transform: `scale(${SCALE})`,
            transformOrigin: "top left",
            overflow: "hidden",
          }}
        >
          <iframe
            ref={iframeRef}
            src={process.env.NEXT_PUBLIC_PREVIEW_APP_URL || "http://localhost:8080"}
            title="Manasik App Preview"
            className="w-full h-full border-0"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            onLoad={handleIframeLoad}
          />
        </div>
      </IphoneFrame>
    </div>
  );
};

