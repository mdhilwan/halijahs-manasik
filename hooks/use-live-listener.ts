import { useEffect, useRef } from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import { Audio } from 'expo-av';
import {API_ROOT, BROADCAST, STREAM} from "@/constants/router-path";
import EventSource, {EventType} from "react-native-sse"

export function useLiveListener(isEnabled: boolean, broadcastState: false | "idle" | "live") {
  const lastChunkIdRef = useRef<number>(0);
  const playingSoundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    let mounted = true;

    let eventSource: EventSource | null = null;

    function startSse() {
      if (!mounted) return;

      eventSource = new EventSource(`${API_ROOT}/${BROADCAST}/${STREAM}`, { withCredentials: false });

      eventSource.addEventListener("status" as EventType, (e: any) => {
        const payload = JSON.parse(e.data);
        // optional: react to status if needed
        console.log("SSE status:", payload);
      });

      eventSource.addEventListener("audio" as EventType, async (e: any) => {
        const payload = JSON.parse(e.data);
        const chunkId = payload.chunkId;
        const data = payload.data;

        if (!data || chunkId === 0) return;
        if (chunkId <= lastChunkIdRef.current) return;

        lastChunkIdRef.current = chunkId;

        const filename = `${FileSystem.cacheDirectory}live_chunk_${chunkId}.m4a`;
        await FileSystem.writeAsStringAsync(filename, data, { encoding: FileSystem.EncodingType.Base64 });

        if (playingSoundRef.current) {
          try {
            await playingSoundRef.current.unloadAsync();
          } catch {}
          playingSoundRef.current = null;
        }

        const sound = new Audio.Sound();
        await sound.loadAsync({ uri: filename });
        playingSoundRef.current = sound;
        await sound.playAsync();

        setTimeout(() => {
          FileSystem.deleteAsync(filename, { idempotent: true }).catch(() => {});
        }, 10000);
      });

      eventSource.addEventListener("error", (err) => {
        console.log("SSE error:", err);
      });
    }

    function stopSse() {
      if (eventSource) {
        eventSource.close();
        eventSource = null;
      }
    }

    if (isEnabled && broadcastState === 'live') {
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });
      startSse();
    } else {
      stopSse();
    }

    return () => {
      mounted = false;
      stopSse();
      if (playingSoundRef.current) {
        playingSoundRef.current.unloadAsync().catch(() => {});
      }
    };
  }, [isEnabled, broadcastState]);
}