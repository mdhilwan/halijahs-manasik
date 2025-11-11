import {Modal, StyleSheet, View, TouchableWithoutFeedback, Text} from "react-native";
import React from "react";
import {useFontSize} from "@/app/contexts/FontSettingsContext";
import {SettingsView} from "@/components/settings-modal/settings-view";

const SettingsModal = () => {
  const { showSettings, setShowSettings } = useFontSize()

  return <Modal
    animationType="slide"
    transparent={true}
    visible={showSettings}
  >
    <TouchableWithoutFeedback onPress={() => setShowSettings(false)}>
      <View style={styles.drawerContainer}>
        <TouchableWithoutFeedback>
          <View style={styles.drawer}>
            <Text style={styles.drawerTitle}>Text Settings</Text>
            <SettingsView/>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
}

const styles = StyleSheet.create({
  drawerTitle: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 15,
    color: '#222',
  },
  drawer: {
    backgroundColor: '#fff',
    padding: 20,
    paddingBottom: 100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  drawerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  settingsText: {
    fontSize: 18,
  },
});

export default SettingsModal