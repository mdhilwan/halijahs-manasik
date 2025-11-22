import React, {createContext, useContext, useEffect, useState} from 'react';
import {API_ROOT, BROADCAST, HEALTH, PRIVATE_LAN, STATUS} from "@/constants/router-path";

interface WifiContextType {
  ssid: undefined | string;
  broadcasting: boolean;
}

const BroadcastContext = createContext<WifiContextType>({
  ssid: undefined,
  broadcasting: false,
});

export function BroadcastProvider({children}: { children: React.ReactNode }) {
  const [ssid, setSsid] = useState<string | undefined>(undefined);
  const [broadcasting, setBroadcasting] = useState<boolean>(false);

  async function updateSSID() {
    try {
      const res = await fetch(`${API_ROOT}/${HEALTH}`);
      if (res.ok) {
        const json = await res.json();
        console.log(json)
        if (json?.OK === true) {
          setSsid(PRIVATE_LAN);
          return;
        }
      }
      setSsid(undefined);
    } catch {
      setSsid(undefined);
    }
  }

  async function getBroadcastState() {
    try {
      const res = await fetch(`${API_ROOT}/${BROADCAST}/${STATUS}`);
      if (res.ok) {
        const json = await res.json();
        if (json?.broadcasting === true) {
          setBroadcasting(json.broadcasting);
        }
      }
    } catch {
      setBroadcasting(false)
    }
  }

  useEffect(() => {
    updateSSID();
    const interval = setInterval(() => {
      updateSSID();
      getBroadcastState();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <BroadcastContext.Provider value={{ssid, broadcasting}}>
      {children}
    </BroadcastContext.Provider>
  );
}

export const useBroadcast = () => useContext(BroadcastContext)