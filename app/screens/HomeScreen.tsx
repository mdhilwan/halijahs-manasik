import React from 'react';
import {TouchableOpacity, StyleSheet, View, ImageBackground, useWindowDimensions} from 'react-native';
import {DuaType, HomeScreenType} from "@/app/types";
import duas from '@/assets/data/duas.json';
import categoriesData from '@/assets/data/categories.json'
import ParallaxScrollView from "@/components/parallax-scroll-view";
import {Image} from "expo-image";
import {Colors} from "@/constants/theme";
import {useLanguage} from "@/app/contexts/LanguageContext";
import {useFonts} from "expo-font";
import {ThemedText} from "@/components/themed-text";

export type buttonType = {
  key: string,
  bgImg?: any
}

const buttons: buttonType[] = [
  { key: 'ihram', bgImg: require('@/assets/images/button-bg/ihram.png') },
  { key: 'talbiyah', bgImg: require('@/assets/images/button-bg/talbiyah.png') },
  { key: 'travel', bgImg: require('@/assets/images/button-bg/travel.png') },
  { key: 'masjidil haram', bgImg: require('@/assets/images/button-bg/masjidil-haram.png') },
  { key: 'tawaf', bgImg: require('@/assets/images/button-bg/tawaf.png') },
  { key: 'zam-zam', bgImg: require('@/assets/images/button-bg/zamzam.png') },
  { key: "sa'i", bgImg: require('@/assets/images/button-bg/sai.png') },
  { key: 'tahalul', bgImg: require('@/assets/images/button-bg/tahallul.png') },
  { key: 'tawaf wadak', bgImg: require('@/assets/images/button-bg/tawaf-wada.png') },
  { key: 'madinah', bgImg: require('@/assets/images/button-bg/madinah.png') },
  { key: 'arafah', bgImg: require('@/assets/images/button-bg/arafah.png') },
  { key: 'mina', bgImg: require('@/assets/images/button-bg/mina.png') },
  { key: 'muzdalifah', bgImg: require('@/assets/images/button-bg/muzdalifah.png') },
  { key: 'stoning', bgImg: require('@/assets/images/button-bg/jamrah.png') }
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
    // @ts-ignore
    const result = duas.filter((d: DuaType) => {
      if (d.categoryKey) {
        return d.categoryKey.includes(category.toLowerCase())
      } else {
        console.log(d, ": has no category")
      }
    });
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

  const {width} = useWindowDimensions();
  const smScreens = width < 390;
  const getCategoryName = (key: string) => {
    const cat = categoriesData.categories.find(c => c.key === key)
    if (!cat) return key

    return language === 'my' ? cat.nameMy : cat.nameEn
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{light: '#D0D0D0', dark: '#353636'}}
      headerImageIpad={
        <Image
          source={require('@/assets/images/hajj-hero-image-tablet.png')}
          style={styles.heroImage}
        />
      }
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
                      loadDuas(btn.key)
                    }}
                    style={styles.button}
                  >
                    {btn.bgImg ? (
                      <ImageBackground
                        source={btn.bgImg}
                        style={styles.bgButtonContainer}
                        imageStyle={{borderRadius: 15}}
                        resizeMode={"cover"}
                      >
                        <ThemedText
                          style={[
                            styles.buttonText,
                            styles.bgButtonText,
                            smScreens && {width: '80%'}
                          ]}
                        >
                          {getCategoryName(btn.key)}
                        </ThemedText>
                      </ImageBackground>
                    ) : (
                      <ThemedText style={styles.buttonText}>
                        {getCategoryName(btn.key)}
                      </ThemedText>
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
    width: '48%',
    maxWidth: 190,
    height: 75,
    backgroundColor: Colors.light.tint,
    borderRadius: 16,
    borderStyle: 'solid',
    borderWidth: 3,
    borderColor: '#3d3d3d',
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
  bgButtonText: {
    color: "#233125",
    fontWeight: 'bold',
    width: '70%',
    textAlign: 'right',
    alignSelf: 'flex-end',
    paddingRight: 15,
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