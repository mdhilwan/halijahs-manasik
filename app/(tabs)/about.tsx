import {StyleSheet, View} from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';
import {useFonts} from "expo-font";
import React, {ReactNode, memo} from "react";
import {Link} from "expo-router";
import {Image} from "expo-image";
import {Collapsible} from "@/components/ui/collapsible";
import {Ionicons} from "@expo/vector-icons";

const Contributor = ({name, description}: { name: ReactNode, description: ReactNode }) => {
  return <View style={{marginVertical:10}}>
    <ThemedText type={"serif"} style={{
      fontSize: 18,
    }}>{name}</ThemedText>
    <ThemedText style={{
      color: "#727272",
    }}>{description}</ThemedText>
  </View>
}

const SocialLink = memo(
  ({ href, icon }: { href: any; icon: ReactNode }) => {
    return (
      <Link href={href} style={{ alignSelf: 'flex-start' }}>
        <ThemedView style={styles.ctaBtn}>
          <ThemedText type={'defaultBold'} style={{ color: '#FFFFFF' }}>
            {icon}
          </ThemedText>
        </ThemedView>
      </Link>
    );
  }
);

SocialLink.displayName = "SocialLink"

export default function About() {
  const [fontLoaded] = useFonts({
    'Mulish-Regular': require('@/assets/font/Mulish-Regular.ttf'),
    'Lora-Regular': require('@/assets/font/Lora-Regular.ttf'),
  });

  return (
    fontLoaded && <ParallaxScrollView
        headerBackgroundColor={{light: '#D0D0D0', dark: '#353636'}}
        headerImage={
          <Image
            source={require('@/assets/images/about-hero-image.png')}
            style={styles.heroImage}
          />
        }>
        <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">
                About
            </ThemedText>
        </ThemedView>
        <Collapsible title="About the App">
            <ThemedText type="default" style={{marginVertical: 10}}>
                Halijah Manasik is a digital Umrah and Hajj guide developed based on the guidebook Menyahut Seruan Ilahi. It is designed to accompany pilgrims through the main rituals of Umrah, whether they are following a mutawwif or performing Umrah on their own.
            </ThemedText>
            <ThemedText type="default" style={{marginVertical: 10}}>
                Our aim is to provide authentic and reliable guidance and to make this app accessible to all pilgrims performing Hajj and Umrah, so that they may carry out their manasik (rites) with greater clarity, confidence and peace of mind. With Allah’s permission, we hope this app becomes a means of ease and guidance throughout this noble and sacred journey.
            </ThemedText>
            <ThemedText type="default" style={{marginVertical: 10}}>
                May this app also be a lasting source of reward and ongoing charity for everyone who has contributed their efforts to it in any way, and especially for the late founder, Allahyarhamah Halijah Binte Abdul Hamid Almunawwarah, the founder of Halijah Travels, whose love for innovation and dedication to finding new ways to support pilgrims continue to inspire this work.
            </ThemedText>
        </Collapsible>

        <Collapsible title="Contributors">
            <Contributor
                name={"Ustaz Haji Sawifi Bin Samson"}
                description={"Author of \"Menyahut Seruan Ilahi\" and \"Sempurnakan Umrah\", which the app’s core content is adapted from."}
            />
            <Contributor
                name={"Ustaz Haji Muhammad Syarafuddeen Bin Mazlan"}
                description={"Structured and organised the app’s content and recorded and produced majority of the in-app audio."}
            />
            <Contributor
                name={"Ustaz Haji Mohammed Iqbal Bin Abdullah"}
                description={"Provided verification and review to ensure the accuracy and reliability of the app content."}
            />
            <Contributor
                name={"Muhammad Hilwan Bin Mohamed Idrus"}
                description={"Software Engineer responsible for the development, and technical implementation and maintenance of the application."}
            />
            <ThemedText>We also extend our gratitude to Turntable Music for providing the studio used for the application’s audio recordings. </ThemedText>
        </Collapsible>


        <ThemedText style={{marginVertical: 10}}>
            To checkout more tours by Halijah Travels, please visit our website and our socials here:
        </ThemedText>

        <View style={{ flexDirection: 'row', gap: 20 }}>
          <SocialLink
            href="https://halijah.com.sg/group-tours"
            icon={<Ionicons name={"globe"} size={25} />}
          />
          <SocialLink
            href="https://www.instagram.com/halijahtravels"
            icon={<Ionicons name={"logo-instagram"} size={25} />}
          />
          <SocialLink
            href="https://www.facebook.com/HalijahTravels"
            icon={<Ionicons name={"logo-facebook"} size={25} />}
          />
          <SocialLink
            href="https://www.youtube.com/@HalijahTravels"
            icon={<Ionicons name={"logo-youtube"} size={25} />}
          />
        </View>
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
  },
  ctaBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  }
});
