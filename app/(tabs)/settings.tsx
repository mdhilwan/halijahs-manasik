import {StyleSheet, Text, TouchableOpacity, TextInput, View} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Collapsible} from '@/components/ui/collapsible';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';
import {IconSymbol} from '@/components/ui/icon-symbol';
import {Fonts} from '@/constants/theme';
import {useLanguage} from "@/app/contexts/LanguageContext";
import {SettingsView} from "@/components/settings-modal/settings-view";
import {useState} from 'react';
import {API_ROOT, BROADCAST, LOGIN, START, STOP} from "@/constants/router-path";
import {useBroadcast} from "@/app/contexts/BroadcastContext";
import {Broadcaster} from "@/components/controls/broadcaster";

export default function Settings() {
  const {broadcastState, stopBroadcasting, setIfIamHost} = useBroadcast()
  const {language, setLanguage} = useLanguage();
  const [otp, setOtp] = useState('');
  const [hostSignedIn, setHostSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const signInHost = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_ROOT}/${LOGIN}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({otp}),
      });
      const json = await res.json();

      if (json?.success) {
        setHostSignedIn(true);
        setIfIamHost(true);
        stopBroadcasting() // will set broadcastState to 'idle'
      }
    } catch (e) {
      console.log('Sign in error', e);
    }
    setLoading(false);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{light: '#D0D0D0', dark: '#353636'}}
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
          style={{width: "100%"}}
        >
          <Picker.Item label="English" value="en"/>
          <Picker.Item label="Malay" value="my"/>
        </Picker>
      </Collapsible>
      <Collapsible title="Font Size">
        <SettingsView/>
      </Collapsible>
      {(hostSignedIn && broadcastState) && <View>
        <Broadcaster/>
      </View>}
      {!broadcastState && <Collapsible title={"Host Signin"}>
        <View style={{gap: 12, padding: 10}}>
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
                <Text style={{color: 'white', textAlign: 'center', fontFamily: Fonts.rounded}}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </>
          )}

        </View>
      </Collapsible>}
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
