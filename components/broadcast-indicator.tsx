import {useBroadcast} from "@/app/contexts/BroadcastContext";
import {Text, View, TouchableOpacity, StyleSheet} from "react-native";
import React, {useEffect, useState} from "react";
import {useLiveListener} from "@/hooks/use-live-listener";
import {Fonts} from "@/constants/theme";

export const BroadcastIndicator = () => {
  const {broadcastState, ifIamHost, stopBroadcasting, startBroadcasting} = useBroadcast()
  const [listening, setListening] = useState<boolean>(false)
  const [wasListening, setWasListening] = useState<boolean>(false)
  useLiveListener(listening, broadcastState);

  useEffect(() => {
    if (broadcastState !== 'live' && !ifIamHost && listening) {
      setListening(false)
    }
    if (listening) {
      setWasListening(true)
    }
  }, [broadcastState, ifIamHost, listening]);

  return <>
    {(wasListening && broadcastState !== 'live') &&
        <View style={{alignItems: 'center', marginBottom: 10}}>
            <Text style={[styles.broadcastBtn, { backgroundColor: 'grey', color: 'white'}]}>
                Broadcast stopped
            </Text>
        </View>
    }
    {(broadcastState === 'live' && !ifIamHost) &&
        <View style={{alignItems: 'center', marginBottom: 10}}>
          {!listening ? (
            <TouchableOpacity onPress={() => setListening(true)}
                              style={styles.broadcastBtn}>
              <Text style={{color: 'white', fontSize: 16, fontWeight: '600'}}>Join Live</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setListening(false)}
                              style={styles.broadcastBtn}>
              <Text style={{color: 'white', fontSize: 16, fontWeight: '600'}}>Stop Listening</Text>
            </TouchableOpacity>
          )}
        </View>
    }
    {(broadcastState === 'live' && ifIamHost) &&
        <View style={{alignItems: 'center', marginBottom: 10}}>
            <TouchableOpacity onPress={() => stopBroadcasting()}
                              style={styles.broadcastBtn}>
                <Text style={{color: 'white', fontSize: 16, fontWeight: '600'}}>Stop Broadcasting</Text>
            </TouchableOpacity>
        </View>
    }
    {(broadcastState !== 'live' && ifIamHost) &&
        <View style={{alignItems: 'center', marginBottom: 10}}>
            <TouchableOpacity onPress={() => startBroadcasting()}
                              style={[styles.broadcastBtn, {
                                backgroundColor: '#28A745'
                              }]}>
                <Text style={{color: 'white', textAlign: 'center', fontFamily: Fonts.rounded}}>
                    Begin Broadcast
                </Text>
            </TouchableOpacity>
        </View>
    }
  </>
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
})