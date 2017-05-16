
import React from 'react';
import { connect } from 'react-redux';
import { View, Text } from '@shoutem/ui';

import { ReactNativeAudioStreaming, Player } from 'react-native-audio-streaming';

import { streamUrl } from './soundcloudHelper';

export default Playing = connect(
    (state) => ({
        song: state.songs[state.currentlyPlaying.id] ? state.songs[state.currentlyPlaying.id][0] : {}
    })
)(({ song }) => (
    <Text>
        Playing {song.uri ? streamUrl(song.uri) : ''}
    </Text>
));

/* <View>
   {song.uri ? <Player url={streamUrl(song.uri)} /> : null}
   </View> */
