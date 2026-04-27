import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FavouriteButtonProps {
  onPress: () => void;
  isFavourited: boolean;
}

export const FavouriteButton: React.FC<FavouriteButtonProps> = ({ onPress, isFavourited }) => {
  return (
    <TouchableOpacity style={[styles.audioButton, { marginLeft: 20 }]} onPress={onPress}>
      <Ionicons
        name={isFavourited ? 'star' : 'star-outline'}
        size={28}
        accessibilityRole="button"
        accessibilityLabel={isFavourited ? 'Remove from favourites' : 'Add to favourites'}
        color={isFavourited ? '#ffd65c' : '#666'}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  audioButton: {
    position: 'absolute',
    left: 135,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
});
