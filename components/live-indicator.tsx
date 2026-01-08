import {Text, View} from "react-native";
import React from "react";
import {useBroadcast} from "@/app/contexts/BroadcastContext";
import {PRIVATE_LAN} from "@/constants/router-path";
import {ThemedText} from "@/components/themed-text";

type LiveIndicatorType = {
  text?: string | boolean
}

export const LiveIndicator = (props: LiveIndicatorType) => {
  const { text } = props
  const {ssid} = useBroadcast();

  return <>{ssid === PRIVATE_LAN ?
    <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
      <View style={{
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: 'green',
        marginLeft: 8
      }}/>
      {<ThemedText style={{
        marginLeft: 10
      }}>{text}</ThemedText>}
    </View> :
    <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
      <View style={{
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: 'grey',
        marginLeft: 8
      }}/>
      {<ThemedText style={{
        marginLeft: 10
      }}>Manasik Router</ThemedText>}
    </View>
  }</>
}