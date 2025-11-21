import React, {createContext, useContext, useEffect, useState} from 'react';

const HalijahManasikAppLAN = "Halijah-Manasik-App-LAN"
const HealthCheckUrl = "http://192.168.8.1:4321/health-check"

interface WifiContextType {
  ssid: undefined | string
}

const WifiContext = createContext<WifiContextType>({
  ssid: undefined
});

export function WifiProvider({children}: { children: React.ReactNode }) {
  const [ssid, setSsid] = useState<string | undefined>(undefined);

  async function updateSSID() {
    try {
      const res = await fetch(HealthCheckUrl);
      if (res.ok) {
        const json = await res.json();
        if (json?.ok === true) {
          setSsid(HalijahManasikAppLAN);
          return;
        }
      }
      setSsid(undefined);
    } catch {
      setSsid(undefined);
    }
  }

  useEffect(() => {
    updateSSID();
    const interval = setInterval(updateSSID, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <WifiContext.Provider value={{ssid}}>
      {children}
    </WifiContext.Provider>
  );
}

export const useWifi = () => useContext(WifiContext)