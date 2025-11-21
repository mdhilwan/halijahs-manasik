import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Collapsible } from '@/components/ui/collapsible';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useLanguage } from "@/app/contexts/LanguageContext";
import {SettingsView} from "@/components/settings-modal/settings-view";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {API_ROOT, BROADCAST, START} from "@/constants/router-path";

export default function Settings() {
  const { language, setLanguage } = useLanguage();

  const startBroadcast = async () => {
    // mock the google login
    const res = await fetch(`${API_ROOT}/${BROADCAST}/${START}`, { method: 'POST' });
    try {
      const json = await res.json();
      console.log(json)
    } catch (e) {
      console.log(e)
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
        <Text>Sign in with Google First</Text>
        <FontAwesome.Button name="wifi" backgroundColor="#4285F4" style={{fontFamily: "Roboto"}} onPress={startBroadcast}>
          Begin Broadcast
        </FontAwesome.Button>
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
