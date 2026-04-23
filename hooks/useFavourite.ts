import { useCallback, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVOURITES_STORAGE_KEY = 'favourited_duas';

/**
 * Custom hook to manage favourite duas
 * @param duaId - The ID of the dua to manage
 * @returns {Object} Object containing isFavourited and toggleFavourite
 */
export const useFavourite = (duaId: number | undefined) => {
  const [isFavourited, setIsFavourited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if dua is favourited on mount or when duaId changes
  useEffect(() => {
    if (!duaId) {
      setIsLoading(false);
      return;
    }

    const checkFavourite = async () => {
      try {
        const storedFavourites = await AsyncStorage.getItem(FAVOURITES_STORAGE_KEY);
        if (storedFavourites) {
          const favouritedIds = JSON.parse(storedFavourites) as number[];
          setIsFavourited(favouritedIds.includes(duaId));
        }
      } catch (error) {
        console.error('Error checking favourite status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkFavourite();
  }, [duaId]);

  const toggleFavourite = useCallback(async () => {
    if (!duaId) return;

    try {
      const storedFavourites = await AsyncStorage.getItem(FAVOURITES_STORAGE_KEY);
      let favouritedIds: number[] = [];

      if (storedFavourites) {
        favouritedIds = JSON.parse(storedFavourites);
      }

      if (isFavourited) {
        // Remove from favourites
        favouritedIds = favouritedIds.filter(id => id !== duaId);
      } else {
        // Add to favourites
        favouritedIds.push(duaId);
      }

      await AsyncStorage.setItem(FAVOURITES_STORAGE_KEY, JSON.stringify(favouritedIds));
      setIsFavourited(!isFavourited);
    } catch (error) {
      console.error('Error toggling favourite:', error);
    }
  }, [duaId, isFavourited]);

  return { isFavourited, toggleFavourite, isLoading };
};

