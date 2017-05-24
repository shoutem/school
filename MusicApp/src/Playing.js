
import React from 'react';
import { connect } from 'react-redux';
import { Text, Spinner } from '@shoutem/ui';
import { ReactNativeAudioStreaming } from 'react-native-audio-streaming';

import { streamUrl } from './soundcloudHelper';

export default Playing = connect(
    (state) => ({
        song: state.songs[state.currentlyPlaying.id] ? state.songs[state.currentlyPlaying.id][0] : {}
    })
)(({ song, dispatch }) => {
    if (song.uri) {
        return (
            <Text>
                Playing {song.title}
            </Text>
        )
    }else{
        return (<Spinner />);
    }
});
