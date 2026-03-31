import React, { useState } from 'react';
import {SafeAreaView} from "react-native-safe-area-context";
import {TouchableOpacity, StyleSheet, View, ScrollView} from 'react-native';
import {DuaEngMalayArabicType, DuaType, SelectedDuaType, HomeStackParamList } from "@/config/types";
import {DuaPlayer} from "@/components/controls/dua-player";
import {useLanguage} from "@/contexts/LanguageContext";
import {useFontSize} from "@/contexts/FontSettingsContext";
import SettingsModal from "@/components/settings-modal";
import {Ionicons} from "@expo/vector-icons";
import {ThemedText} from "@/components/themed-text";
import {ThemedView} from "@/components/themed-view";
import { useNavigation } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ArabicText({dua}: { dua: DuaEngMalayArabicType }) {
  const {arabicFontSize, duaHidden} = useFontSize()
  if (dua.arabic === "" || duaHidden) {
    return null
  }
  return <View style={[styles.textWrapper, {marginVertical: 10}]}>
    <ThemedText type={"arabic"} style={{fontSize: arabicFontSize}}>{dua.arabic}</ThemedText>
  </View>
}

function TranslationText({dua, translationKey}: {
  dua: DuaEngMalayArabicType,
  translationKey: "translationMy" | "translationEn"
}) {
  const {translationFontSize, translationHidden} = useFontSize()
  if (dua[translationKey].length === 0 || translationHidden) {
    return null
  }
  return <ThemedView style={[styles.textWrapper, {marginVertical: 10}]}>
    {typeof dua[translationKey] === "string" ?
      <ThemedText style={[styles.translation, {fontSize: translationFontSize}]}>
        {dua[translationKey]}
      </ThemedText> :
      <ThemedText style={styles.textWrapper}>
        {dua[translationKey].map((duaLine: string, index: number) =>
          <ThemedText key={index} style={[styles.translation, {textAlign: "left", fontSize: translationFontSize}]}>
            • {duaLine + '\n'}
          </ThemedText>
        )}
      </ThemedText>}
  </ThemedView>
}

type DuaDetailScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'duaDetail'>;

export default function DuaDetailScreen() {
  const navigation = useNavigation<DuaDetailScreenNavigationProp>();
  const route = useRoute();
  const params = route.params as { selectedDua: SelectedDuaType | string };
  
  // Handle both direct object and serialized string params
  const initialSelectedDua: SelectedDuaType = typeof params.selectedDua === 'string' 
    ? JSON.parse(params.selectedDua) 
    : params.selectedDua;

  const [selectedDua, setSelectedDua] = useState<SelectedDuaType>(initialSelectedDua);

  const {language} = useLanguage();
  const {setShowSettings} = useFontSize()
  const duaObj = selectedDua?.duas?.find((dua: DuaType) => {
    return dua.id === selectedDua?.curr
  })
  const [isFavourited, setIsFavourited] = useState(false);

  // Check if current dua is favourited
  React.useEffect(() => {
    if (duaObj) {
      checkIfFavourited(duaObj.id);
    }
  }, [duaObj]);

  const checkIfFavourited = async (duaId: number) => {
    try {
      const storedFavourites = await AsyncStorage.getItem('favourited_duas');
      if (storedFavourites) {
        const favouritedIds = JSON.parse(storedFavourites) as number[];
        setIsFavourited(favouritedIds.includes(duaId));
      }
    } catch (error) {
      console.error('Error checking favourite status:', error);
    }
  };

  const toggleFavourite = async () => {
    if (!duaObj) return;

    try {
      const storedFavourites = await AsyncStorage.getItem('favourited_duas');
      let favouritedIds: number[] = [];

      if (storedFavourites) {
        favouritedIds = JSON.parse(storedFavourites);
      }

      if (isFavourited) {
        // Remove from favourites
        favouritedIds = favouritedIds.filter(id => id !== duaObj.id);
      } else {
        // Add to favourites
        favouritedIds.push(duaObj.id);
      }

      await AsyncStorage.setItem('favourited_duas', JSON.stringify(favouritedIds));
      setIsFavourited(!isFavourited);
    } catch (error) {
      console.error('Error toggling favourite:', error);
    }
  };

  const titleKey = language === 'my' ? "titleMy" : "titleEn"
  const translationKey = language === 'my' ? "translationMy" : "translationEn"

  const handleBack = () => {
    if (selectedDua?.duas.length === 1) {
      navigation.goBack();
    } else {
      navigation.goBack();
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <ThemedText>
              <Ionicons size={36} name={"chevron-back"}/>
            </ThemedText>
          </TouchableOpacity>

          <View style={styles.headerActions}>
            <TouchableOpacity onPress={toggleFavourite} style={styles.starButton}>
              <Ionicons
                size={28}
                name={isFavourited ? "star" : "star-outline"}
                color={isFavourited ? "#ffd65c" : "#666"}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowSettings(true)}>
              <ThemedText style={styles.fontSettings}>Aa</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
        {
          (duaObj) &&
            <>
                <ThemedText style={styles.title}>{duaObj[titleKey]}</ThemedText>
                <ThemedView style={{ flex: 1 }}>
                  <ScrollView>
                    {
                      duaObj.doa.map((dua: DuaEngMalayArabicType) => {
                        return <ThemedView key={dua.id}>
                          <ArabicText dua={dua}/>
                          <TranslationText dua={dua} translationKey={translationKey}/>
                        </ThemedView>
                      })
                    }
                  </ScrollView>
                </ThemedView>
            </>
        }
        <DuaPlayer dua={duaObj as DuaType} selectedDua={selectedDua} setSelectedDua={setSelectedDua} isFavourited={isFavourited} toggleFavourite={toggleFavourite}/>

        <SettingsModal/>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fontSettings: {
    fontSize: 20,
  },
  drawerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  container: {
    flex: 1,
    padding: 20,
    marginBottom: 0,
    paddingBottom: 0,
    height: '100%'
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Mulish-Bold',
    paddingVertical: 20,
    flexShrink: 1
  },
  textWrapper: {
    width: "100%",
    marginRight: 5,
    marginBottom: 5,
    flexShrink: 1,
    paddingBottom: 10
  },
  translation: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Mulish-Bold',
    textAlign: 'center',
  },
  back: {
    fontSize: 18,
    marginBottom: 10
  },
  drawerTitle: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 15,
    color: '#222',
  },
  drawer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  controls: {
    flexDirection: 'row',
    gap: 10,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  closeButton: {
    textAlign: 'center',
    marginTop: 20,
    color: '#007AFF',
    fontSize: 18,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starButton: {
    marginRight: 15,
  },
});
