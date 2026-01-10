import React from 'react';
import {Text, TouchableOpacity, StyleSheet, View, ImageBackground} from 'react-native';
import {DuaType, HomeScreenType} from "@/app/types";
import duas from '@/assets/data/duas.json';
import ParallaxScrollView from "@/components/parallax-scroll-view";
import {Image} from "expo-image";
import {Colors} from "@/constants/theme";
import {useLanguage} from "@/app/contexts/LanguageContext";
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
    title: 'Ihram',
    bgImg: require('@/assets/images/button-bg/ihram-illustration.png')
  },
  {
    title: 'Talbiyah',
    bgImg: require('@/assets/images/button-bg/talbiyah-illustration.png')
  },
  {
    title: 'Travel',
    bgImg: require('@/assets/images/button-bg/travel-illustration.png')
  },
  {
    title: 'Masjidil Haram',
    bgImg: require('@/assets/images/button-bg/hajj-button-bg.png')
  },
  {
    title: 'Tawaf',
    bgImg: require('@/assets/images/button-bg/masjid-haram-aerial-view.png')
  },
  {
    title: 'Zam-zam' ,
    bgImg: require('@/assets/images/button-bg/zamzam-illustration.png')
  },
  {
    title: "Sa'i" ,
    bgImg: require('@/assets/images/button-bg/sai-illustration.png')
  },
  {
    title: 'Tahalul' ,
    bgImg: require('@/assets/images/button-bg/tahalul-illustration.png')
  },
  {
    title: 'Tawaf Wadak' ,
    bgImg: require('@/assets/images/button-bg/tawaf-wadak-illustration.png')
  },
  {
    title: 'Madinah' ,
    bgImg: require('@/assets/images/button-bg/madinah-illustration.png')
  },
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
          source={require('@/assets/images/hajj-hero-image.png')}
          style={styles.heroImage}
        />
      }
    >
      {fontLoaded &&
          <>
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
                        <View style={styles.imageOverlay} />
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
  title: {fontSize: 20, fontFamily: 'Mulish-Bold', fontWeight: 'bold', textAlign: 'center'},
  button: {
    width: 162, //'48%',
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
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
  },
  bgButtonText: {
    color: "#233125",
    fontWeight: 'bold',
    width: '70%',
    textAlign: 'left',
    alignSelf: 'flex-start',
    paddingLeft: 15,
  },
  heroImage: {
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
    fontFamily: 'Mulish-Bold',
  },
});