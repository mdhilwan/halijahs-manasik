import React from "react";
import AppNavigator from "@/app/screens/AppNavigator";
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

export default function App() {

  const [loaded] = Font.useFonts({
    ...Ionicons.font,
  });

  if (!loaded) return null;

  return <AppNavigator />
}