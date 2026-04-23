import React from 'react';
import { View } from 'react-native';
import Slider from '@react-native-community/slider';
import { Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

interface SeekBarProps {
  position: number;
  duration: number;
  onSeek: (value: number) => void;
  disabled: boolean;
}

export const SeekBar: React.FC<SeekBarProps> = ({ position, duration, onSeek, disabled }) => {
  const color = useColorScheme();

  return (
    <View style={{ width: '100%', marginTop: 5, alignItems: 'center' }}>
      <Slider
        style={{ width: '100%', height: 40 }}
        minimumValue={0}
        maximumValue={duration}
        value={position}
        onSlidingStart={() => {}}
        onSlidingComplete={onSeek}
        minimumTrackTintColor={Colors.base.tint}
        maximumTrackTintColor="#ddd"
        thumbTintColor={color === 'dark' ? Colors.dark.tint : Colors.light.tint}
        disabled={disabled}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
        <ThemedText style={{ fontSize: 14, color: '#555' }}>{formatTime(position)}</ThemedText>
        <ThemedText style={{ fontSize: 14, color: '#555' }}>{formatTime(duration)}</ThemedText>
      </View>
    </View>
  );
};
