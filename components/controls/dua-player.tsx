import React, {useEffect} from 'react';
import {View} from 'react-native';
import {PlayStopButtonType} from '@/config/types';
import {ThemedView} from '@/components/themed-view';
import {AudioProvider, useAudio} from '@/contexts/AudioContext';
import {PrevButton} from './prev-button';
import {PlayPauseButton} from './play-button';
import {NextButton} from './next-button';
import {FavouriteButton} from './favourite-button';
import {SeekBar} from './seek-bar';

const DuaPlayerContent: React.FC<PlayStopButtonType> = ({
                                                          dua,
                                                          setSelectedDua,
                                                          selectedDua,
                                                          isFavourited,
                                                          toggleFavourite,
                                                        }) => {
  const {isPlaying, loading, duration, position, handlePlayPause, handleSeek, loadAudio, sound} = useAudio();

  useEffect(() => {
    if (dua?.audio) {
      loadAudio(dua.audio);
    }
  }, [dua?.audio]);

  if (!selectedDua) {
    return <></>;
  }

  const {duas, curr} = selectedDua;

  if (!duas || curr === undefined) {
    return <></>;
  }
  const currIndex = duas.findIndex((d) => d.id === curr);

  const hasNext = () => currIndex !== -1 && duas[currIndex + 1] !== undefined;
  const hasPrev = () => currIndex > 0 && duas[currIndex - 1] !== undefined;
  const getNext = () => (hasNext() ? duas[currIndex + 1] : undefined);
  const getPrev = () => (hasPrev() ? duas[currIndex - 1] : undefined);

  return (
    <View style={{alignItems: 'center'}}>
      <ThemedView style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <PrevButton onPress={() => setSelectedDua({curr: getPrev()?.id, duas})} disabled={!hasPrev()}/>
        <PlayPauseButton onPress={handlePlayPause} isPlaying={isPlaying} loading={loading} disabled={!dua?.audio}/>
        <NextButton onPress={() => setSelectedDua({curr: getNext()?.id, duas})} disabled={!hasNext()}/>
        {toggleFavourite && <FavouriteButton onPress={toggleFavourite} isFavourited={!!isFavourited}/>}
      </ThemedView>
      {dua?.audio &&
          <SeekBar position={position} duration={duration} onSeek={handleSeek} disabled={loading || !sound}/>}
    </View>
  );
};

export const DuaPlayer = (props: PlayStopButtonType) => {
  return (
    <AudioProvider>
      <DuaPlayerContent {...props} />
    </AudioProvider>
  );
};
