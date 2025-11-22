import {View} from "react-native";
import React from "react";
import {useBroadcast} from "@/app/contexts/BroadcastContext";

export const LiveIndicator = () => {
  const {ssid} = useBroadcast();

  return <>{ssid === 'Halijah-LAN' &&
      <View style={{
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: 'green',
        marginLeft: 8
      }}></View>
  }</>
}