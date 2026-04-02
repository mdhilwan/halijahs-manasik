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
    </Stack>
  );
}

