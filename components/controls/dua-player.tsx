import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {PlayStopButtonType} from '@/config/types';
import {ThemedView} from '@/components/themed-view';
import {AudioProvider, useAudio} from '@/contexts/AudioContext';
import {PrevButton} from './prev-button';
import {PlayPauseButton} from './play-button';
import {NextButton} from './next-button';
import {FavouriteButton} from './favourite-button';
import {SeekBar} from './seek-bar';
import {RepeatButton} from './repeat-button';

const DuaPlayerContent: React.FC<PlayStopButtonType> = ({
                                                          dua,
                                                          setSelectedDua,
                                                          selectedDua,
                                                          isFavourited,
                                                          toggleFavourite,
                                                        }) => {
  const {
    isPlaying,
    isLooping,
    toggleLooping,
    loading,
    duration,
    position,
    handlePlayPause,
    handleSeek,
    loadAudio,
    sound
  } = useAudio();

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
    <ThemedView style={{alignItems: 'center', boxShadow: '0px -10px 25px rgba(0, 0, 0, 0.15)', width: '100%', paddingTop: 10, paddingLeft: 20, paddingRight: 20, marginBottom: -20}}>
      <ThemedView style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        <RepeatButton onPress={toggleLooping} isLooping={isLooping} disabled={!dua?.audio}/>
        <PrevButton onPress={() => setSelectedDua({curr: getPrev()?.id, duas})} disabled={!hasPrev()}/>
        <PlayPauseButton onPress={handlePlayPause} isPlaying={isPlaying} loading={loading} disabled={!dua?.audio}/>
        <NextButton onPress={() => setSelectedDua({curr: getNext()?.id, duas})} disabled={!hasNext()}/>
        {toggleFavourite && <FavouriteButton onPress={toggleFavourite} isFavourited={!!isFavourited}/>}
      </ThemedView>
      {dua?.audio &&
          <SeekBar position={position} duration={duration} onSeek={handleSeek} disabled={loading || !sound}/>}
    </ThemedView>
  );
};

export const DuaPlayer = (props: PlayStopButtonType) => {
  return (
    <AudioProvider>
      <DuaPlayerContent {...props} />
    </AudioProvider>
  );
};
