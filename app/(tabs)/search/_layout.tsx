import { Stack } from 'expo-router';
import React from 'react';

export default function SearchStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Search',
        }}
      />
      <Stack.Screen
        name="dua-detail"
        options={{
          title: 'Dua Detail',
        }}
      />
    </Stack>
  );
}

