import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import {API_ROOT, BROADCAST, HEALTH, PRIVATE_LAN, CURRENT, START, STOP, AUDIO} from "@/constants/router-path";
import {Audio, InterruptionModeAndroid, InterruptionModeIOS} from "expo-av";
import {UPLOAD_INTERVAL_MS} from "@/constants/broadcast-time";
import * as FileSystem from "expo-file-system/legacy";
import {fetchWithTimeout} from "@/app/utils";

interface WifiContextType {
  ssid: undefined | string;
  broadcastState: 'idle' | 'live' | false;
  ifIamHost: boolean,
  setIfIamHost: (iamHost: boolean) => void;
  startBroadcasting: () => void;
  stopBroadcasting: () => void;
}

const BroadcastContext = createContext<WifiContextType>({
  ssid: undefined,
  broadcastState: false,
  ifIamHost: false,
  setIfIamHost: () => {},
  startBroadcasting: () => {},
  stopBroadcasting: () => {},
});

export function BroadcastProvider({children}: { children: React.ReactNode }) {
  const [ssid, setSsid] = useState<string | undefined>(undefined);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const [broadcastState, setBroadcastState] = useState<'idle' | 'live' | false>(false);
  const [ifIamHost, setIfIamHostState] = useState<boolean>(false);

  const BROADCASTING_FLAG = useRef(false);

  async function startRecordingLoop() {
    try {
      await fetch(`${API_ROOT}/${BROADCAST}/${START}`, {method: 'POST'});
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        staysActiveInBackground: false,
        interruptionModeIOS: InterruptionModeIOS.MixWithOthers,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        playsInSilentModeIOS: true,
      });

      startChunkCycle(); // start the cycle
    } catch (e) {
      console.error("startRecordingLoop error", e);
    }
  }

  async function startChunkCycle() {
    // Kick off the continuous start/stop cycle
    // We'll record for UPLOAD_INTERVAL_MS, stop, upload, then restart
    async function recordOnce() {
      try {
        // Create a new recording instance
        const rec = new Audio.Recording();
        recordingRef.current = rec;

        await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
        await rec.startAsync();

        // Wait for the chunk duration
        await new Promise((r) => setTimeout(r, UPLOAD_INTERVAL_MS));

        // Stop & get URI
        await rec.stopAndUnloadAsync();
        const uri = rec.getURI();
        recordingRef.current = null;

        if (uri) {
          // read as base64
          const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          // POST the base64 WAV to server
          await fetch(`${API_ROOT}/${BROADCAST}/${AUDIO}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({data: base64}),
          });

          // Optionally delete the temp file
          try {
            await FileSystem.deleteAsync(uri, {idempotent: true});
          } catch (e) {
            console.log("Error:", e)
          }
        }

        // If still broadcasting, schedule the next chunk
        if (BROADCASTING_FLAG.current) {
          // small delay before starting next chunk to allow system to stabilize (tune if needed)
          recordOnce();
        }
      } catch (err) {
        // console.error("recordOnce error", err);
        // If error and still broadcasting, try to restart after short delay
        if (BROADCASTING_FLAG.current) setTimeout(recordOnce, 500);
      }
    }

    recordOnce();
  }

  const startBroadcasting = () => {
    setBroadcastState('live');
    BROADCASTING_FLAG.current = true
    startRecordingLoop()
  };

  const stopBroadcasting = async () => {
    setBroadcastState('idle');
    BROADCASTING_FLAG.current = false
    try {
      await fetch(`${API_ROOT}/${BROADCAST}/${STOP}`, {method: 'POST'});
      if (recordingRef.current) {
        try {
          await recordingRef.current.stopAndUnloadAsync();
        } catch {
        }
        recordingRef.current = null;
      }
    } catch (e) {
      console.error('stopBroadcasting error', e);
    }
  };

  async function updateSSID() {
    try {
      const res = await fetchWithTimeout(`${API_ROOT}/${HEALTH}`);
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
    } catch {
      if (ssid) {
        setBroadcastState("idle");
      } else {
        setBroadcastState(false);
      }
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
    setInterval(() => {
      updateSSID();
      getBroadcastState();
    }, 1000);
  }, []);

  return (
    <BroadcastContext.Provider value={{ssid, broadcastState, setIfIamHost, ifIamHost, startBroadcasting, stopBroadcasting}}>
      {children}
    </BroadcastContext.Provider>
  );
}

export const useBroadcast = () => useContext(BroadcastContext)