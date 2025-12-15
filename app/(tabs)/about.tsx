import {StyleSheet} from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';
import {IconSymbol} from '@/components/ui/icon-symbol';
import {useFonts} from "expo-font";
import {ReactNode} from "react";
import {Link} from "expo-router";

const Contributor = ({name, description}: { name: ReactNode, description: ReactNode }) => {
  return <>
    <ThemedText type={"serif"} style={{
      fontSize: 18,
    }}>{name}</ThemedText>
    <ThemedText style={{
      color: "#727272",
    }}>{description}</ThemedText>
  </>
}

export default function About() {
  const [fontLoaded] = useFonts({
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
            <ThemedText type="title">
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

        <ThemedText>We also extend our gratitude to all others who supported this effort. May Allah bless and reward everyone who contributed in any way to the development of this app.</ThemedText>

        <ThemedText style={{marginBottom: 12}}>
            To checkout more tours by Halijah Travels, please visit our website here:
        </ThemedText>

        <Link href="https://halijah.com.sg/group-tours">
            <ThemedView style={styles.ctaBtn}>
                <ThemedText type={'defaultBold'} style={{color: '#FFFFFF'}}>
                    Halijah Travels Website
                </ThemedText>
            </ThemedView>
        </Link>

        <Link href="https://www.instagram.com/halijahtravels">
            <ThemedView style={styles.ctaBtn}>
                <ThemedText type={'defaultBold'} style={{color: '#FFFFFF'}}>
                    Instagram
                </ThemedText>
            </ThemedView>
        </Link>

        <Link href="https://www.facebook.com/HalijahTravels">
            <ThemedView style={styles.ctaBtn}>
                <ThemedText type={'defaultBold'} style={{color: '#FFFFFF'}}>
                    Facebook
                </ThemedText>
            </ThemedView>
        </Link>
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
  ctaBtn: {
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
