import React, {useState, useEffect} from 'react';
import {TouchableOpacity, StyleSheet, ScrollView, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFonts} from 'expo-font';
import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';
import {useLanguage} from '@/contexts/LanguageContext';
import {useRouter} from 'expo-router';
import {DuaType} from '@/config/types';
import {Ionicons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import duas from '@/assets/data/duas.json';
import categoriesData from '@/assets/data/categories.json';
import {Image} from "expo-image";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import {useColorScheme} from "@/hooks/use-color-scheme";

const FAVOURITES_STORAGE_KEY = 'favourited_duas';

export default function FavouritesScreen(): React.JSX.Element {
  const router = useRouter();
  const {language} = useLanguage();
  const [fontLoaded] = useFonts({
    'Mulish-Bold': require('@/assets/font/Mulish-Bold.ttf'),
  });
  const theme = useColorScheme()
  const [favouritedDuas, setFavouritedDuas] = useState<DuaType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavouritedDuas();
  }, [favouritedDuas]);

  const loadFavouritedDuas = async () => {
    try {
      const storedFavourites = await AsyncStorage.getItem(FAVOURITES_STORAGE_KEY);
      if (storedFavourites) {
        const favouritedIds = JSON.parse(storedFavourites) as number[];
        const favouritedDuaObjects = duas.filter((dua: DuaType) =>
          favouritedIds.includes(dua.id)
        );
        setFavouritedDuas(favouritedDuaObjects);
      }
    } catch (error) {
      console.error('Error loading favourited duas:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavourites = async (duaId: number) => {
    try {
      const storedFavourites = await AsyncStorage.getItem(FAVOURITES_STORAGE_KEY);
      if (storedFavourites) {
        const favouritedIds = JSON.parse(storedFavourites) as number[];
        const updatedIds = favouritedIds.filter(id => id !== duaId);
        await AsyncStorage.setItem(FAVOURITES_STORAGE_KEY, JSON.stringify(updatedIds));

        // Update local state
        setFavouritedDuas(prev => prev.filter(dua => dua.id !== duaId));
      }
    } catch (error) {
      console.error('Error removing from favourites:', error);
    }
  };

  const confirmRemoveFavourite = (dua: DuaType) => {
    const titleKey = language === 'my' ? 'titleMy' : 'titleEn';
    Alert.alert(
      language === 'my' ? 'Buang dari Kegemaran' : 'Remove from Favourites',
      language === 'my'
        ? `Adakah anda pasti mahu buang "${dua[titleKey]}" dari kegemaran?`
        : `Are you sure you want to remove "${dua[titleKey]}" from favourites?`,
      [
        {
          text: language === 'my' ? 'Batal' : 'Cancel',
          style: 'cancel',
        },
        {
          text: language === 'my' ? 'Buang' : 'Remove',
          style: 'destructive',
          onPress: () => removeFromFavourites(dua.id),
        },
      ]
    );
  };

  const navigateToDuaDetail = (dua: DuaType) => {
    router.push({
      pathname: '/home/duaDetail',
      params: {
        selectedDua: JSON.stringify({curr: dua.id, duas: favouritedDuas})
      }
    });
  };

  const getCategoryName = (categoryKey: string[]) => {
    if (!categoryKey || categoryKey.length === 0) return '';

    // Find the main category
    const mainCategory = categoriesData.categories.find(cat =>
      categoryKey.includes(cat.key)
    );

    if (mainCategory) {
      return language === 'my' ? mainCategory.nameMy : mainCategory.nameEn;
    }

    return '';
  };

  if (!fontLoaded || loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedText style={styles.loadingText}>
          {language === 'my' ? 'Memuatkan...' : 'Loading...'}
        </ThemedText>
      </SafeAreaView>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{light: '#D0D0D0', dark: '#353636'}}
      headerImageIpad={
        <Image
          source={require('@/assets/images/settings-hero-image-tablet.png')}
          style={styles.heroImage}
        />
      }
      headerImage={
        <Image
          source={require('@/assets/images/settings-hero-image.png')}
          style={styles.heroImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">
          Favourites
        </ThemedText>
      </ThemedView>
      <ThemedView>
        {favouritedDuas.length === 0 ? (
          <ThemedView style={styles.emptyState}>
            <Ionicons name="star-outline" size={64} color="#ccc"/>
            <ThemedText type={"default"} style={styles.emptyStateText}>
              {language === 'my'
                ? 'Tiada doa kegemaran lagi. Tekan ikon bintang pada doa untuk menambahkannya ke kegemaran.'
                : 'No favourite prayers yet. Tap the star icon on prayers to add them to favourites.'}
            </ThemedText>
          </ThemedView>
        ) : (
          <ScrollView style={styles.scrollView}>
            {favouritedDuas.map((dua) => {
              const titleKey = language === 'my' ? 'titleMy' : 'titleEn';
              const categoryName = getCategoryName(dua.categoryKey);

              return (
                <TouchableOpacity
                  key={dua.id}
                  style={[
                    styles.duaItem,
                    {backgroundColor: theme === 'dark' ? '#1c1c1c' : '#fff'},
                    {borderColor: theme === 'dark' ? '#333' : '#e0e0e0'},
                  ]}
                  onPress={() => navigateToDuaDetail(dua)}
                >
                  <ThemedView style={styles.duaContent}>
                    <ThemedView style={styles.duaTextContainer}>
                      <ThemedText type={"defaultBold"} style={styles.duaTitle} numberOfLines={2}>
                        {dua[titleKey]}
                      </ThemedText>
                      {categoryName && (
                        <ThemedText style={styles.categoryText}>
                          {categoryName}
                        </ThemedText>
                      )}
                    </ThemedView>
                    <TouchableOpacity
                      style={styles.starButton}
                      onPress={() => confirmRemoveFavourite(dua)}
                    >
                      <Ionicons name="star" size={24} color="#ffd65c"/>
                    </TouchableOpacity>
                  </ThemedView>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 20,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 24,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 5,
  },
  duaItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderColor: '#e0e0e0',
    borderWidth: 2,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  duaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  duaTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  duaTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  starButton: {
    padding: 8,
  },
});
