import {Modal, StyleSheet, View, TouchableWithoutFeedback} from "react-native";
import React from "react";
import {useFontSize} from "@/contexts/FontSettingsContext";
import {SettingsView} from "@/components/settings-modal/settings-view";
import {ThemedText} from "@/components/themed-text";
import {LanguagePicker} from "@/components/settings-modal/language-picker";
import {useColorScheme} from "@/hooks/use-color-scheme";
import {ThemedView} from "@/components/themed-view";

const SettingsModal = () => {
  const { showSettings, setShowSettings } = useFontSize()
  const color = useColorScheme();

  return <Modal
    animationType="slide"
    transparent={true}
    visible={showSettings}
  >
    <TouchableWithoutFeedback onPress={() => setShowSettings(false)}>
      <ThemedView style={styles.drawerContainer}>
        <TouchableWithoutFeedback>
          <ThemedView style={[
            styles.drawer,
          ]}>
            <ThemedText style={[
              styles.drawerTitle,
              {color: color === 'dark' ? '#fff' : '#000'}
            ]}>Text Settings</ThemedText>
            <LanguagePicker/>
            <SettingsView/>
          </ThemedView>
        </TouchableWithoutFeedback>
      </ThemedView>
    </TouchableWithoutFeedback>
  </Modal>
}

const styles = StyleSheet.create({
  drawerTitle: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 15,
  },
  drawer: {
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