import React, {createContext, useContext, useEffect, useState} from 'react';
import {API_ROOT, BROADCAST, HEALTH, PRIVATE_LAN, CURRENT} from "@/constants/router-path";

interface WifiContextType {
  ssid: undefined | string;
  broadcastState: 'idle' | 'live' | false;
  ifIamHost: boolean,
  setIfIamHost: (iamHost: boolean) => void;
}

const BroadcastContext = createContext<WifiContextType>({
  ssid: undefined,
  broadcastState: false,
  ifIamHost: false,
  setIfIamHost: () => {},
});

export function BroadcastProvider({children}: { children: React.ReactNode }) {
  const [ssid, setSsid] = useState<string | undefined>(undefined);
  const [broadcastState, setBroadcastState] = useState<'idle' | 'live' | false>(false);
  const [ifIamHost, setIfIamHostState] = useState<boolean>(false);

  async function updateSSID() {
    try {
      const res = await fetch(`${API_ROOT}/${HEALTH}`);
      if (res.ok) {
        const json = await res.json();
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
      const res = await fetch(`${API_ROOT}/${BROADCAST}/${CURRENT}`);
      if (res.ok) {
        const json = await res.json();
        setBroadcastState(json.broadcasting);
      }
    } catch(e: any) {
      console.log("Error: ", e)
      setBroadcastState(false);
    }
  }

  const setIfIamHost = async (iamHost: boolean) => {
    try {
      setIfIamHostState(iamHost);
    } catch (e) {
      console.warn('Error saving language:', e);
    }
  };

  useEffect(() => {
    updateSSID();
    const interval = setInterval(() => {
      updateSSID();
      getBroadcastState();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <BroadcastContext.Provider value={{ssid, broadcastState, setIfIamHost, ifIamHost}}>
      {children}
    </BroadcastContext.Provider>
  );
}

export const useBroadcast = () => useContext(BroadcastContext)