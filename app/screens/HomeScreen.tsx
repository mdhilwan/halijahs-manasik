import React from 'react';
import {Text, TouchableOpacity, StyleSheet, View} from 'react-native';
import {HomeScreenType} from "@/app/types";
import duas from '../../assets/data/duas.json';
import ParallaxScrollView from "@/components/parallax-scroll-view";
import {Image} from "expo-image";

const buttons = [
  {title: 'Intention'},
  {title: 'Talbiyah'},
  {title: 'Masjidil Haram'},
  {title: 'Tawaf'},
  {title: 'Zam-zam'},
  {title: "Sa'i"},
  {title: 'Tahalul'},
  {title: 'Madinah'},
];

export default function HomeScreen({setScreen, setDuas}: HomeScreenType): React.JSX.Element {
  const loadDuas = async (category: string) => {
    const result = duas.filter(d => d.category.toLowerCase() === category.toLowerCase());
    setDuas(result);
    setScreen('duaList');
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
      <Text style={styles.title}>Halijah&#39;s Manasik App</Text>

      <View style={styles.grid}>
        {buttons.map((btn, index) =>
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() => loadDuas(btn.title)}
          >
            <Text style={styles.buttonText}>{btn.title}</Text>
          </TouchableOpacity>
        )}
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  title: {fontSize: 26, fontWeight: 'bold', marginBottom: 30, textAlign: 'center'},
  button: {
    width: '48%',
    height: 100,
    backgroundColor: '#00796b',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  reactLogo: {
    height: 178,
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  buttonText: {color: '#fff', fontSize: 20, textAlign: 'center'},
});