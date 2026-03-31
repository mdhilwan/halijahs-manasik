import React, { useState } from 'react';
import {TouchableOpacity, StyleSheet, View, ImageBackground, useWindowDimensions} from 'react-native';
import duas from '@/assets/data/duas.json';
import categoriesData from '@/assets/data/categories.json'
import ParallaxScrollView from "@/components/parallax-scroll-view";
import {Image} from "expo-image";
import {useLanguage} from "@/contexts/LanguageContext";
import {useFonts} from "expo-font";
import {ThemedText} from "@/components/themed-text";
import { useNavigation } from 'expo-router';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {DuaType, HomeStackParamList} from '@/config/types';
import {Colors} from "@/constants/theme";

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

type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'index'>;

export default function HomeScreen(): React.JSX.Element {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const {language} = useLanguage();
  const [fontLoaded] = useFonts({
    'Mulish-Bold': require('@/assets/font/Mulish-Bold.ttf'),
  });
  const [mode, setMode] = useState<'hajj' | 'umrah'>('hajj');

  const loadDuas = async (category: string) => {
    // @ts-ignore
    let result = duas.filter((d: DuaType) => {
      if (d.categoryKey) {
        return d.categoryKey.includes(category.toLowerCase())
      } else {
        console.log(d, ": has no category")
      }
    });
    const subCategories = categoriesData.categories.find((cat) => cat.key === category.toLowerCase())?.subcategories
    
    if (subCategories) {
      const subCategoriesKey = (subCategories.map(cat => cat.key))
      const subCategoriesResult = (duas.filter((d: DuaType) => {
        if (d.categoryKey) {
          return subCategoriesKey.some((sub) => d.categoryKey.includes(sub))
        }
      }))
      result = [...result, ...subCategoriesResult]
    }

    if (result.length === 1) {
      navigation.navigate('duaDetail', {
        selectedDua: { curr: result[0].id, duas: result}
      });
    } else {
      navigation.navigate('duaList', {
        category,
        duas: result
      });
    }
  };

  const {width} = useWindowDimensions();
  const smScreens = width < 445;
  
  const getCategoryName = (key: string) => {
    const cat = categoriesData.categories.find(c => c.key === key)
    if (!cat) return key

    return language === 'my' ? cat.nameMy : cat.nameEn
  }

  // Filter buttons based on mode
  const getFilteredButtons = () => {
    if (mode === 'hajj') {
      return buttons; // Show all buttons for hajj
    } else {
      // For umrah, filter out hajj-only sections
      const hajjOnlySections = ['arafah', 'mina', 'muzdalifah', 'stoning'];
      return buttons.filter(btn => !hajjOnlySections.includes(btn.key));
    }
  };

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
      {fontLoaded && (
        <>
          <TouchableOpacity
            style={styles.switchToggleContainer}
            onPress={() => setMode(mode === 'hajj' ? 'umrah' : 'hajj')}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.switchToggleSlider,
                mode === 'umrah' && styles.switchToggleSliderUmrah,
              ]}
            />
            <View style={styles.switchToggleLabelContainer}>
              <ThemedText
                type={"defaultBold"}
                style={[
                  styles.switchToggleLabel,
                  mode === 'hajj' && styles.switchToggleLabelActive,
                ]}
              >
                {language === 'my' ? 'Haji' : 'Hajj'}
              </ThemedText>
              <ThemedText
                type={"defaultBold"}
                style={[
                  styles.switchToggleLabel,
                  mode === 'umrah' && styles.switchToggleLabelActive,
                ]}
              >
                {language === 'my' ? 'Umrah' : 'Umrah'}
              </ThemedText>
            </View>
          </TouchableOpacity>

          <View style={styles.grid}>
            {getFilteredButtons().map((btn, index) =>
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
                        smScreens && {width: '70%'}
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
        </>
      )}
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
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  switchToggleContainer: {
    height: 50,
    maxWidth: 400,
    width: '100%',
    marginHorizontal: 'auto',
    backgroundColor: '#e0e0e0',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    flexDirection: 'row',
    position: 'relative',
    paddingHorizontal: 4,
  },
  switchToggleSlider: {
    position: 'absolute',
    width: '50%',
    height: 42,
    backgroundColor: Colors.light.tint,
    borderRadius: 21,
    left: 4,
    zIndex: 1,
  },
  switchToggleSliderUmrah: {
    left: 'auto',
    right: 4,
  },
  switchToggleLabelContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 2,
  },
  switchToggleLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  switchToggleLabelActive: {
    color: '#ffd65c',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#3d3d3d',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  toggleButtonActive: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3d3d3d',
  },
  toggleButtonTextActive: {
    color: '#ffd65c',
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
    width: '90%',
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