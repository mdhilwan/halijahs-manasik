import {StyleSheet} from 'react-native';
import {Collapsible} from '@/components/ui/collapsible';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';
import {SettingsView} from "@/components/settings-modal/settings-view";
import React from 'react';
import {Image} from "expo-image";
import {LanguagePicker} from "@/components/settings-modal/language-picker";

export default function Settings() {
  return (
    <ParallaxScrollView
      headerImageIpad={
        <Image
          source={require('@/assets/images/current/settings-hero-image-tablet.png')}
          style={styles.heroImage}
        />
      }
      headerImage={
        <Image
          source={require('@/assets/images/current/settings-hero-image.png')}
          style={styles.heroImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">
          Settings
        </ThemedText>
      </ThemedView>
      <Collapsible title="Language">
        <LanguagePicker/>
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
  heroImage: {
    height: 178,
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
  }
});
