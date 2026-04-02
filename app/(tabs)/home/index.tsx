import React, { useCallback } from 'react';
import { TouchableOpacity, StyleSheet, View, ImageBackground, useWindowDimensions } from 'react-native';
import categoriesData from '@/assets/data/categories.json';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { Image } from 'expo-image';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHajiUmrahFilter } from '@/contexts/HajiUmrahFilterContext';
import { ThemedText } from '@/components/themed-text';
import { useNavigation } from 'expo-router';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/config/types';
import { Colors } from '@/constants/theme';
import { useFontLoader } from '@/hooks/useFontLoader';
import { useDuaLoader } from '@/hooks/useDuaLoader';
import { useFilteredButtons } from '@/constants/home-screen';

type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'index'>;

export default function HomeScreen(): React.JSX.Element {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { language } = useLanguage();
  const { mode, toggleMode } = useHajiUmrahFilter();
  const fontLoaded = useFontLoader();
  const { loadDuas } = useDuaLoader();
  const { width } = useWindowDimensions();
  
  const filteredButtons = useFilteredButtons(mode);
  const isSmallScreen = width < 445;

  const getCategoryName = useCallback((key: string): string => {
    const cat = categoriesData.categories.find(c => c.key === key);
    if (!cat) return key;
    return language === 'my' ? cat.nameMy : cat.nameEn;
  }, [language]);

  const handleCategoryPress = useCallback((categoryKey: string) => {
    const result = loadDuas(categoryKey);

    if (result.length === 1) {
      navigation.navigate('duaDetail', {
        selectedDua: { curr: result[0].id, duas: result },
      });
    } else {
      navigation.navigate('duaList', {
        category: categoryKey,
        duas: result,
      });
    }
  }, [loadDuas, navigation]);


  if (!fontLoaded) {
    return <ThemedText>Loading fonts...</ThemedText>;
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
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
      <TouchableOpacity
        style={styles.switchToggleContainer}
        onPress={toggleMode}
        activeOpacity={0.8}
        accessible={true}
        accessibilityRole="switch"
        accessibilityState={{ checked: mode === 'haji' }}
        accessibilityLabel={`Switch between Hajj and Umrah mode, currently on ${mode}`}
      >
        <View
          style={[
            styles.switchToggleSlider,
            mode === 'umrah' && styles.switchToggleSliderUmrah,
          ]}
        />
        <View style={styles.switchToggleLabelContainer}>
          <ThemedText
            type="defaultBold"
            style={[
              styles.switchToggleLabel,
              mode === 'haji' && styles.switchToggleLabelActive,
            ]}
          >
            {language === 'my' ? 'Haji' : 'Haji'}
          </ThemedText>
          <ThemedText
            type="defaultBold"
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
        {filteredButtons.map((btn) => (
          <TouchableOpacity
            key={btn.key}
            onPress={() => handleCategoryPress(btn.key)}
            style={styles.button}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={getCategoryName(btn.key)}
          >
            {btn.bgImg ? (
              <ImageBackground
                source={btn.bgImg}
                style={styles.bgButtonContainer}
                imageStyle={{ borderRadius: 15 }}
                resizeMode="cover"
              >
                <ThemedText
                  style={[
                    styles.buttonText,
                    styles.bgButtonText,
                    isSmallScreen && { width: '74.2%' },
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
        ))}
      </View>
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