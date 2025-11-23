import React, {useRef, useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import {Audio, InterruptionModeAndroid, InterruptionModeIOS} from 'expo-av';
import {Fonts} from "@/constants/theme";
import {API_ROOT, BROADCAST, START, STOP} from "@/constants/router-path";
import {UPLOAD_INTERVAL_MS} from "@/constants/broadcast-time";

export const Broadcaster = () => {
  const recordingRef = useRef<Audio.Recording | null>(null);
  const [isBroadcasting, setIsBroadcasting] = useState(false);

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

      setIsBroadcasting(true);
      BROADCASTING_FLAG.current = true;
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
          await fetch(`${API_ROOT}/broadcast/audio`, {
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

  async function stopBroadcasting() {
    setIsBroadcasting(false);
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
  }

  return (
    <View>
      {!isBroadcasting && (<>
          <TouchableOpacity
            onPress={startRecordingLoop}
            style={[styles.broadcastBtn, {
              backgroundColor: '#28A745'
            }]}
          >
            <Text style={{color: 'white', textAlign: 'center', fontFamily: Fonts.rounded}}>
              Begin Broadcast
            </Text>
          </TouchableOpacity>
        </>
      )}
      {isBroadcasting && (
        <TouchableOpacity
          onPress={stopBroadcasting}
          style={styles.broadcastBtn}
        >
          <Text style={{color: 'white', textAlign: 'center', fontFamily: Fonts.rounded}}>
            Stop Broadcast
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  broadcastBtn: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3
  }
});