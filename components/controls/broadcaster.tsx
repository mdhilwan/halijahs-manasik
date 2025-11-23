import React, {useRef, useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {Fonts} from "@/constants/theme";
import {useBroadcast} from "@/app/contexts/BroadcastContext";

export const Broadcaster = () => {
  const {startBroadcasting, stopBroadcasting} = useBroadcast()

  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const BROADCASTING_FLAG = useRef(false);

  return (
    <View>
      {!isBroadcasting && (<>
          <TouchableOpacity
            onPress={() => {
              setIsBroadcasting(true)
              BROADCASTING_FLAG.current = true
              startBroadcasting()
            }}
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
          onPress={() => {
            setIsBroadcasting(false)
            BROADCASTING_FLAG.current = false
            stopBroadcasting()
          }}
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