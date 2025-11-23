import { useEffect, useRef } from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import { Audio } from 'expo-av';
import {API_ROOT, AUDIO, BROADCAST} from "@/constants/router-path";
import {POLL_INTERVAL} from "@/constants/broadcast-time";

export function useLiveListener(isEnabled: boolean) {
  const lastChunkIdRef = useRef<number>(0);
  const pollRef = useRef<number | null>(null);
  const playingSoundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    let mounted = true;

    async function pollOnce() {
      try {
        const res = await fetch(`${API_ROOT}/${BROADCAST}/${AUDIO}`, { cache: 'no-store' });
        if (!res.ok) return;
        const json = await res.json();
        const chunkId = json?.chunkId || 0;
        const data = json?.data || null;
        if (!data || chunkId === 0) return;

        // skip if same as last played
        if (chunkId <= lastChunkIdRef.current) return;
        lastChunkIdRef.current = chunkId;

        // write base64 to temp file
        const filename = `${FileSystem.cacheDirectory}live_chunk_${chunkId}.3gp`;

        await FileSystem.writeAsStringAsync(filename, data, { encoding: FileSystem.EncodingType.Base64 });

        // unload previous sound if any
        if (playingSoundRef.current) {
          try {
            await playingSoundRef.current.unloadAsync();
          } catch {}
          playingSoundRef.current = null;
        }

        // load and play
        const sound = new Audio.Sound();
        await sound.loadAsync({ uri: filename });
        playingSoundRef.current = sound;
        await sound.playAsync();

        // optional: delete after a bit to free storage
        setTimeout(() => {
          FileSystem.deleteAsync(filename, { idempotent: true }).catch(() => {});
        }, 5000);
      } catch (e) {
        console.log("Poll Once Error: ", e)
      }
    }

    function startPolling() {
      if (!mounted) return;
      pollOnce(); // immediate
      pollRef.current = setInterval(pollOnce, POLL_INTERVAL) as unknown as number;
    }

    function stopPolling() {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    }

    if (isEnabled) {
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      mounted = false;
      stopPolling();
      if (playingSoundRef.current) {
        playingSoundRef.current.unloadAsync().catch(() => {});
      }
    };
  }, [isEnabled]);
}