import {Tabs} from 'expo-router';
import React from 'react';

import {HapticTab} from '@/components/haptic-tab';
import {Colors} from '@/constants/theme';
import {useColorScheme} from '@/hooks/use-color-scheme';
import {LanguageProvider} from "@/app/contexts/LanguageContext";
import {FontSettingsProvider} from "@/app/contexts/FontSettingsContext";
import {Ionicons} from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <FontSettingsProvider>
      <LanguageProvider>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            headerShown: false,
            tabBarButton: HapticTab,
          }}>
          <Tabs.Screen
            name="search"
            options={{
              title: 'Search',
              tabBarIcon: ({color}) => <Ionicons size={28} name={"search"} color={color}/>,
            }}
          />
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({color}) => <Ionicons size={28} name={"home"} color={color}/>,
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: 'Settings',
              tabBarIcon: ({color}) => <Ionicons size={28} name={"settings"} color={color}/>,
            }}
          />
          <Tabs.Screen
            name="about"
            options={{
              title: 'about',
              tabBarIcon: ({color}) => <Ionicons size={28} name={"information"} color={color}/>,
            }}
          />
        </Tabs>
      </LanguageProvider>
    </FontSettingsProvider>
  );
}
