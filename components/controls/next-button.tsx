import React from 'react';
import { TouchableOpacity , StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';

interface NextButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export const NextButton: React.FC<NextButtonProps> = ({ onPress, disabled }) => {
  return (
    <TouchableOpacity 
      style={[styles.audioButton, { marginLeft: 20, opacity: disabled ? 0.25 : 1 }]}
      onPress={onPress}
      disabled={disabled}
    >
      <ThemedText>
        <Ionicons name="play-skip-forward" size={28} />
      </ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  audioButton: {
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
});
