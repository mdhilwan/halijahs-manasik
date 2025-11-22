import {useBroadcast} from "@/app/contexts/BroadcastContext";
import {Text, View, TouchableOpacity, StyleSheet} from "react-native";

export const BroadcastIndicator = () => {
  const {broadcastState, ifIamHost} = useBroadcast()

  return <>
    {(broadcastState === 'live' && !ifIamHost) &&
        <View style={{alignItems: 'center'}}>
            <TouchableOpacity
                onPress={() => {
                }}
                style={styles.broadcastBtn}
            >
                <Text style={{color: 'white', fontSize: 16, fontWeight: '600'}}>
                    Join Live
                </Text>
            </TouchableOpacity>
        </View>
    }
    {(broadcastState === 'live' && ifIamHost) &&
        <View style={{alignItems: 'center'}}>
                <Text style={{fontSize: 16, color: '#FF3B30'}}>
                    Stop Broadcasting in the Settings
                </Text>
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