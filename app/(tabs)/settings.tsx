import {StyleSheet, Text, TouchableOpacity, TextInput, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Collapsible } from '@/components/ui/collapsible';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useLanguage } from "@/app/contexts/LanguageContext";
import {SettingsView} from "@/components/settings-modal/settings-view";
import { useState } from 'react';
import {API_ROOT, BROADCAST, LOGIN, START, STOP} from "@/constants/router-path";

export default function Settings() {
  const { language, setLanguage } = useLanguage();
  const [otp, setOtp] = useState('');
  const [hostSignedIn, setHostSignedIn] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);
  const [loading, setLoading] = useState(false);

  const signInHost = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_ROOT}/${LOGIN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp }),
      });
      const json = await res.json();

      if (json?.success) {
        setHostSignedIn(true);
      }
    } catch (e) {
      console.log('Sign in error', e);
    }
    setLoading(false);
  };

  const startBroadcastHandler = async () => {
    try {
      await fetch(`${API_ROOT}/${BROADCAST}/${START}`, { method: 'POST' });
      setBroadcasting(true);
    } catch (e) {
      console.log(e);
    }
  };

  const stopBroadcastHandler = async () => {
    try {
      await fetch(`${API_ROOT}/${BROADCAST}/${STOP}`, { method: 'POST' });
      setBroadcasting(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="gear"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          Settings
        </ThemedText>
      </ThemedView>
      <ThemedText>Set common app settings here.</ThemedText>
      <Collapsible title="Language">
        <Picker
          selectedValue={language}
          onValueChange={(value) => setLanguage(value)}
          style={{ width: "100%" }}
        >
          <Picker.Item label="English" value="en" />
          <Picker.Item label="Malay" value="my" />
        </Picker>
      </Collapsible>
      <Collapsible title="Font Size">
        <SettingsView/>
      </Collapsible>
      <Collapsible title={"Host Signin"}>
        <View style={{ gap: 12, padding: 10 }}>
          {!hostSignedIn && (
            <>
              <TextInput
                value={otp}
                onChangeText={setOtp}
                placeholder="Enter OTP"
                keyboardType="numeric"
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  padding: 10,
                  borderRadius: 8,
                }}
              />

              <TouchableOpacity
                onPress={signInHost}
                disabled={loading}
                style={{
                  backgroundColor: loading ? '#999' : '#0085FF',
                  padding: 12,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: 'white', textAlign: 'center', fontFamily: Fonts.rounded }}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* Host Signed In */}
          {hostSignedIn && !broadcasting && (
            <TouchableOpacity
              onPress={startBroadcastHandler}
              style={{
                backgroundColor: '#28A745',
                padding: 12,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: 'white', textAlign: 'center', fontFamily: Fonts.rounded }}>
                Begin Broadcast
              </Text>
            </TouchableOpacity>
          )}

          {/* Broadcasting */}
          {broadcasting && (
            <TouchableOpacity
              onPress={stopBroadcastHandler}
              style={{
                backgroundColor: '#DC3545',
                padding: 12,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: 'white', textAlign: 'center', fontFamily: Fonts.rounded }}>
                Stop Broadcast
              </Text>
            </TouchableOpacity>
          )}

        </View>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
