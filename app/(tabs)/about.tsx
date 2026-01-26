import {StyleSheet, View} from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';
import {useFonts} from "expo-font";
import React, {ReactNode, memo} from "react";
import {ExternalPathString, Link} from "expo-router";
import {Image} from "expo-image";
import {Collapsible} from "@/components/ui/collapsible";
import {Ionicons} from "@expo/vector-icons";
import AboutContent from "@/app/contents/about.json"

const Contributor = ({name, description}: { name: ReactNode, description: ReactNode }) => {
  return <View style={{marginVertical: 10}}>
    {name && <ThemedText type={"serif"} style={{
      fontSize: 18,
    }}>{name}</ThemedText>}
    <ThemedText style={{
      color: "#727272",
    }}>{description}</ThemedText>
  </View>
}

const SocialLink = memo(
  ({href, icon}: { href: any; icon: ReactNode }) => {
    return (
      <Link href={href} style={{alignSelf: 'flex-start'}}>
        <ThemedView style={styles.ctaBtn}>
          <ThemedText type={'defaultBold'} style={{color: '#FFFFFF'}}>
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
        headerImageIpad={
          <Image
            source={require('@/assets/images/about-hero-image-tablet.png')}
            style={styles.heroImage}
          />
        }
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
          {AboutContent.about.map((text, index) =>
            <ThemedText key={index} type="default" style={{marginVertical: 10}}>
              {text}
            </ThemedText>
          )}
        </Collapsible>

        <Collapsible title="Contributors">
          {AboutContent.contributors.map(({name, description}, index) =>
            <Contributor
              key={index}
              name={name}
              description={description}
            />
          )}
        </Collapsible>

        <ThemedText style={{marginVertical: 10}}>
          {AboutContent.footer.socialsIntro}
        </ThemedText>

        <View style={{flexDirection: 'row', gap: 20}}>
          {AboutContent.footer.socialLinks.map(({href, icon}, index) =>
            <SocialLink
              key={index}
              href={href}
              icon={<Ionicons name={icon as any} size={25} />}
            />
          )}
        </View>

        {AboutContent.getInTouch && <Collapsible title="Get In Touch" open={true}>
            <ThemedText>{AboutContent.getInTouch.intro}</ThemedText>
            <Link href={AboutContent.getInTouch.emailAddress as ExternalPathString} style={{ marginTop: 10 }}>
                <ThemedText type="defaultBold" style={{ color: '#d38827' }}>
                  {AboutContent.getInTouch.emailText}
                </ThemedText>
            </Link>
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
  heroImage: {
    height: 178,
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  ctaBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#d38827',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  }
});
