import {StyleSheet} from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';
import {IconSymbol} from '@/components/ui/icon-symbol';
import {useFonts} from "expo-font";
import {ReactNode} from "react";

const Contributor = ({name, description}: {name: ReactNode, description: ReactNode}) => {
  return <>
    <ThemedText style={{
      fontFamily: 'Lora-Regular',
      fontSize: 18,
      marginBottom: 0,
    }}>{name}</ThemedText>
    <ThemedText style={{
      color: "#727272",
      fontFamily: 'Mulish-Regular',
    }}>{description}</ThemedText>
  </>
}

export default function About() {
  const [fontLoaded] = useFonts({
    'Mulish-Bold': require('@/assets/font/Mulish-Bold.ttf'),
    'Mulish-Regular': require('@/assets/font/Mulish-Regular.ttf'),
    'Lora-Regular': require('@/assets/font/Lora-Regular.ttf'),
  });

  return (
    fontLoaded && <ParallaxScrollView
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
                  fontFamily: 'Mulish-Bold'
                }}>
                About
            </ThemedText>
        </ThemedView>
        <Contributor
            name={"Ustaz Haji Sawifi Bin Samson"}
            description={"Author of \"Menyahut Seruan Ilahi\" and \"Sempurnakan Umrah\", which the app’s core content is adapted from."}
        />
        <Contributor
            name={"Ustaz Haji Muhammad Syarafuddeen Bin Mazlan"}
            description={"Structured and organised the app’s content and recorded and produced all in-app audio."}
        />
        <Contributor
            name={"Ustaz Haji Mohammed Iqbal Bin Abdullah"}
            description={"Provided verification and review to ensure the accuracy and reliability of the app content."}
        />
        <Contributor
            name={"Muhammad Hilwan Bin Mohamed Idrus"}
            description={"Software Engineer responsible for the development, and technical implementation and maintenance of the application."}
        />

        <ThemedText style={{fontFamily: "Mulish-Regular"}}>We also extend our gratitude to all others who supported this effort. May Allah bless and reward
            everyone who contributed in any way to the development of this app.</ThemedText>
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
