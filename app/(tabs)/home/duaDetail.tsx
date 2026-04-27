import React, { useState, useCallback, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity, View, ScrollView } from 'react-native';
import {DuaEngMalayArabicType, DuaType, SelectedDuaType, HomeStackParamList, CategoryType} from '@/config/types';
import { DuaPlayer } from '@/components/controls/dua-player';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFontSize } from '@/contexts/FontSettingsContext';
import SettingsModal from '@/components/settings-modal';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useNavigation } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFavourite } from '@/hooks/useFavourite';
import { duaDetailStyles as styles } from './styles/homeScreenStyles';
import { useDuaLoader } from "@/hooks/useDuaLoader";

/**
 * Renders Arabic text section if available
 */
function ArabicText({ dua }: { dua: DuaEngMalayArabicType }) {
  const { arabicFontSize, duaHidden } = useFontSize();

  if (dua.arabic === '' || duaHidden) {
    return null;
  }

  return (
    <View style={[styles.textWrapper, { marginVertical: 10 }]}>
      <ThemedText type="arabic" style={{ fontSize: arabicFontSize }}>
        {dua.arabic}
      </ThemedText>
    </View>
  );
}

/**
 * Renders translation text section
 */
function TranslationText({
  dua,
  translationKey,
}: {
  dua: DuaEngMalayArabicType;
  translationKey: 'translationMy' | 'translationEn';
}) {
  const { translationFontSize, translationHidden } = useFontSize();

  if (dua[translationKey].length === 0 || translationHidden) {
    return null;
  }

  return (
    <ThemedView style={[styles.textWrapper, { marginVertical: 10 }]}>
      {typeof dua[translationKey] === 'string' ? (
        <ThemedText style={[styles.translation, { fontSize: translationFontSize }]}>
          {dua[translationKey]}
        </ThemedText>
      ) : (
        <ThemedText style={styles.textWrapper}>
          {(dua[translationKey] as string[]).map((duaLine: string, index: number) => (
            <ThemedText
              key={index}
              style={[styles.translation, { textAlign: 'left', fontSize: translationFontSize }]}
            >
              • {duaLine}
              {'\n'}
            </ThemedText>
          ))}
        </ThemedText>
      )}
    </ThemedView>
  );
}

type DuaDetailScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'duaDetail'>;

export default function DuaDetailScreen() {
  const navigation = useNavigation<DuaDetailScreenNavigationProp>();
  const { currentDuas, cmsData } = useDuaLoader();
  const route = useRoute();
  const params = route.params as { selectedDua: SelectedDuaType | string };

  // Handle both direct object and serialized string params
  const initialSelectedDua: SelectedDuaType = 
    typeof params.selectedDua === 'string' 
      ? JSON.parse(params.selectedDua) 
      : params.selectedDua;

  const [selectedDua, setSelectedDua] = useState<SelectedDuaType>(initialSelectedDua);

  // Synchronize selectedDua state when currentDuas is updated
  useEffect(() => {
    if (initialSelectedDua && (!initialSelectedDua.duas || cmsData) && currentDuas) {
      setSelectedDua(prev => ({
        ...prev,
        duas: currentDuas
      }));
    }
  }, [currentDuas, cmsData]);

  const { language } = useLanguage();
  const { setShowSettings } = useFontSize();

  let duaObj = selectedDua?.duas?.find((dua: DuaType) => dua.id === selectedDua?.curr);
  if (duaObj && duaObj.doa === undefined) {
    const catObj = duaObj as unknown as CategoryType;
    const nextCategoryDoas = currentDuas.filter((dua: { categoryKey: string | string[]; }) => dua.categoryKey.includes(catObj.key))
    duaObj = nextCategoryDoas[0]
    setSelectedDua({
      curr: duaObj.id,
      duas: nextCategoryDoas
    })
  }
  const { isFavourited, toggleFavourite } = useFavourite(duaObj?.id);

  const titleKey = language === 'my' ? 'titleMy' : 'titleEn';
  const translationKey = language === 'my' ? 'translationMy' : 'translationEn';

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleShowSettings = useCallback(() => {
    setShowSettings(true);
  }, [setShowSettings]);
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={handleBack}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Go back to previous screen"
          >
            <ThemedText>
              <Ionicons size={36} name="chevron-back" />
            </ThemedText>
          </TouchableOpacity>

          <View style={styles.headerActions}>
            <TouchableOpacity 
              onPress={toggleFavourite}
              style={styles.starButton}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={isFavourited ? 'Remove from favourites' : 'Add to favourites'}
            >
              <Ionicons
                size={28}
                name={isFavourited ? 'star' : 'star-outline'}
                color={isFavourited ? '#ffd65c' : '#666'}
              />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleShowSettings}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Open font size settings"
            >
              <ThemedText style={styles.fontSettings}>Aa</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {(duaObj && duaObj.doa) && (
          <>
            <ThemedText style={styles.title}>{duaObj[titleKey]}</ThemedText>
            <ThemedView style={{ flex: 1, paddingLeft: 15, paddingRight: 15 }}>
              <ScrollView>
                {duaObj.doa.map((dua: DuaEngMalayArabicType) => (
                  <ThemedView key={dua.id}>
                    <ArabicText dua={dua} />
                    <TranslationText dua={dua} translationKey={translationKey} />
                  </ThemedView>
                ))}
              </ScrollView>
            </ThemedView>
          </>
        )}

        <DuaPlayer 
          dua={duaObj as DuaType} 
          selectedDua={selectedDua} 
          setSelectedDua={setSelectedDua} 
          isFavourited={isFavourited} 
          toggleFavourite={toggleFavourite}
        />

        <SettingsModal />
      </SafeAreaView>
    </ThemedView>
  );
}

