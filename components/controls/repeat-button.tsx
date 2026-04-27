import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RepeatButtonProps {
  onPress: () => void;
  isLooping: boolean;
  disabled?: boolean;
}

const ACTIVE_COLOR = '#ffd65c';
const INACTIVE_COLOR = '#fff';

export const RepeatButton: React.FC<RepeatButtonProps> = ({ onPress, isLooping, disabled }) => {
  const iconColor = disabled ? INACTIVE_COLOR : isLooping ? ACTIVE_COLOR : INACTIVE_COLOR;

  return (
    <TouchableOpacity
      style={[
        styles.audioButton,
        {
          backgroundColor: disabled ? 'gray' : 'black',
          borderColor: disabled ? 'gray' : 'black',
          opacity: disabled ? 0.25 : 1,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={disabled ? 'Repeat unavailable' : isLooping ? 'Repeat on' : 'Repeat off'}
    >
      <Ionicons name="repeat" size={25} color={iconColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  audioButton: {
    position: 'absolute',
    right: 165,
    padding: 4,
    borderRadius: 100,
    borderStyle: 'solid',
    borderWidth: 1,
    marginTop: 10,
  },
});

