import { Stack } from 'expo-router';
import React from 'react';

export default function HomeStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Stack.Screen
        name="duaList"
        options={{
          title: 'Duas',
        }}
      />
      <Stack.Screen
        name="duaDetail"
        options={{
          title: 'Dua Detail',
        }}
      />
    </Stack>
  );
}

