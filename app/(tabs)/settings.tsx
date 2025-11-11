import { StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Collapsible } from '@/components/ui/collapsible';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useLanguage } from "@/app/contexts/LanguageContext";
import {SettingsView} from "@/components/settings-modal/settings-view";

export default function Settings() {
  const { language, setLanguage } = useLanguage();

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
