import React, {useCallback, useEffect} from 'react';
import { TouchableOpacity, View, ImageBackground, useWindowDimensions } from 'react-native';
import categoriesData from '@/assets/data/categories.json';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { Image } from 'expo-image';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHajiUmrahFilter } from '@/contexts/HajiUmrahFilterContext';
import { ThemedText } from '@/components/themed-text';
import { useNavigation, useRouter } from 'expo-router';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/config/types';
import { useFontLoader } from '@/hooks/useFontLoader';
import { useDuaLoader } from '@/hooks/useDuaLoader';
import { useFilteredButtons } from '@/constants/home-screen';
import { indexStyles as styles } from './styles/homeScreenStyles';

type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'index'>;

export default function HomeScreen(): React.JSX.Element {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { language } = useLanguage();
  const { mode, toggleMode } = useHajiUmrahFilter();
  const fontLoaded = useFontLoader();
  const { loadDuas, selectedDuaId } = useDuaLoader();
  const { width } = useWindowDimensions();
  const router = useRouter();

  const filteredButtons = useFilteredButtons(mode);
  const isSmallScreen = width < 445;

  const getCategoryName = useCallback((key: string): string => {
    const cat = categoriesData.categories?.find(c => c.key === key);
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


  useEffect(() => {
    /* This app is being loaded by the CMS preview and telling it to load a specific dua */
    if (selectedDuaId) {
      router.push({
        pathname: '/home/duaDetail',
        params: {
          selectedDua: JSON.stringify({curr: selectedDuaId})
        }
      });
    }
  }, [selectedDuaId])


  if (!fontLoaded) {
    return <ThemedText>Loading fonts...</ThemedText>;
  }

  return (
    <ParallaxScrollView
      headerImageIpad={
        <Image
          source={require('@/assets/images/current/hajj-hero-image-tablet.png')}
          style={styles.heroImage}
        />
      }
      headerImage={
        <Image
          source={require('@/assets/images/current/hajj-hero-image.png')}
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
            {language === 'my' ? 'Haji' : 'Hajj'}
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
