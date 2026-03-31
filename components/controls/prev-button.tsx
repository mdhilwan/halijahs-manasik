import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";

interface PrevButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export const PrevButton: React.FC<PrevButtonProps> = ({ onPress, disabled }) => {
  return (
    <TouchableOpacity
      style={[styles.audioButton, { marginRight: 20, opacity: disabled ? 0.25 : 1 }]}
      onPress={onPress}
      disabled={disabled}
    >
      <ThemedText>
        <Ionicons name="play-skip-back" size={28} />
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
