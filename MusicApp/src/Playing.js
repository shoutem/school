
import React from 'react';
import { connect } from 'react-redux';
import { Text, Spinner } from '@shoutem/ui';
import { ReactNativeAudioStreaming } from 'react-native-audio-streaming';

import { streamUrl } from './soundcloudHelper';

export default Playing = connect(
    (state) => ({
        currentlyPlaying: state.currentlyPlaying,
        songs: state.songs
    })
)(({ songs, currentlyPlaying, dispatch }) => {
    let song = null;

    if (currentlyPlaying.genre && currentlyPlaying.songIndex >= 0) {
        song = songs[currentlyPlaying.genre.id][currentlyPlaying.songIndex];
    }

    if (song && song.uri) {
        return (
            <Text>
                Playing {song.title}
            </Text>
        )
    }else{
        return (<Spinner />);
    }
});
