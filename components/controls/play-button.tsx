import React from "react";
import { TouchableOpacity , StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PlayPauseButtonProps {
  onPress: () => void;
  isPlaying: boolean;
  loading: boolean;
  disabled?: boolean;
}

export const PlayPauseButton: React.FC<PlayPauseButtonProps> = ({
  onPress,
  isPlaying,
  loading,
  disabled,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.audioButton,
        {
          backgroundColor: disabled ? "gray" : "black",
          borderRadius: 100,
          borderStyle: "solid",
          borderColor: disabled ? "gray" : "black",
          opacity: disabled ? 0.25 : 1,
        },
      ]}
      onPress={onPress}
      disabled={loading || disabled}
    >
      {loading ? (
        <Ionicons name="time" size={28} color={"white"} />
      ) : isPlaying ? (
        <Ionicons name="pause" size={28} color={"white"} />
      ) : (
        <Ionicons name="play" size={28} color={"white"} />
      )}
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
