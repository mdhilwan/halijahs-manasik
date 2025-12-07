import React from 'react';
import {Text, TouchableOpacity, StyleSheet, View, ImageBackground} from 'react-native';
import {DuaType, HomeScreenType} from "@/app/types";
import duas from '@/assets/data/duas.json';
import ParallaxScrollView from "@/components/parallax-scroll-view";
import {Image} from "expo-image";
import {Colors} from "@/constants/theme";
import {useLanguage} from "@/app/contexts/LanguageContext";
import {LiveIndicator} from "@/components/live-indicator";
import {BroadcastIndicator} from "@/components/broadcast-indicator";
import {useFonts} from "expo-font";

export type buttonType = {
  title: {
    en: string,
    my: string
  },
  bgImg?: any
} | {
  title: string,
  bgImg?: any
}

const buttons: buttonType[] = [
  {
    title: {
      en: 'Intention',
      my: 'Niat'
    },
  },
  {title: 'Talbiyah'},
  {title: 'Masjidil Haram'},
  {title: 'Tawaf'},
  {title: 'Zam-zam'},
  {title: "Sa'i"},
  {title: 'Tahalul'},
  {title: 'Tawaf-Wada'},
  {title: 'Madinah'},
];

export default function HomeScreen({
                                     setScreen,
                                     setDuas,
                                     setCategory,
                                     setSelectedDua
                                   }: HomeScreenType): React.JSX.Element {

  const {language} = useLanguage();
  const [fontLoaded] = useFonts({
    'Mulish-Bold': require('@/assets/font/Mulish-Bold.ttf'),
  });

  const loadDuas = async (category: string) => {
    const result = duas.filter((d: DuaType) => d.categoryKey.includes(category.toLowerCase()));
    if (result.length === 1) {
      setDuas(result);
      setCategory(category);
      setScreen('duaDetail');
      setSelectedDua({curr: 0, duas: result})
    } else {
      setDuas(result);
      setCategory(category);
      setScreen('duaList');
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{light: '#D0D0D0', dark: '#353636'}}
      headerImage={
        <Image
          source={require('@/assets/images/hajj-hero-image.jpg')}
          style={styles.reactLogo}
        />
      }
    >
      {fontLoaded &&
          <>
              <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={styles.title}>Manasik App by Halijah</Text>
                  <LiveIndicator/>
              </View>
              <BroadcastIndicator/>

              <View style={styles.grid}>
                {buttons.map((btn, index) =>
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      if (typeof btn.title === 'string') {
                        loadDuas(btn.title)
                      } else {
                        loadDuas(btn.title[language])
                      }
                    }}
                    style={styles.button}
                  >
                    {btn.bgImg ? (
                      <ImageBackground
                        source={btn.bgImg}
                        style={styles.bgButtonContainer}
                        imageStyle={{borderRadius: 15}}
                      >
                        <Text
                          style={[styles.buttonText, styles.bgButtonText]}
                        >
                          {typeof btn.title === 'string' ? btn.title : btn.title[language]}
                        </Text>
                      </ImageBackground>
                    ) : (
                      <Text style={styles.buttonText}>
                        {typeof btn.title === 'string' ? btn.title : btn.title[language]}
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
          </>}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  title: {fontSize: 26, fontFamily: 'Mulish-Bold', fontWeight: 'bold', textAlign: 'center'},
  button: {
    width: '48%',
    height: 75,
    backgroundColor: Colors.light.tint,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  bgButtonContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  bgButtonText: {
    color: "#315437",
    fontWeight: 'bold',
    width: '70%',
    textAlign: 'left',
    alignSelf: 'flex-start',
    paddingLeft: 15,
  },
  reactLogo: {
    height: 178,
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  buttonText: {
    color: '#ffd65c',
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'Mulish-Bold'
  },
});