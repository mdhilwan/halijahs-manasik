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

export default function About() {
  const {broadcastState, stopBroadcasting, setIfIamHost} = useBroadcast()
  const {language, setLanguage} = useLanguage();
  const [otp, setOtp] = useState('');
  const [hostSignedIn, setHostSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{light: '#D0D0D0', dark: '#353636'}}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="info"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          About
        </ThemedText>
      </ThemedView>
      <ThemedText>Contributors</ThemedText>

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
