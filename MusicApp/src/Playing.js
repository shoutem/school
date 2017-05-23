
import React from 'react';
import { connect } from 'react-redux';
import { Text } from '@shoutem/ui';

import { streamUrl } from './soundcloudHelper';

export default Playing = connect(
    (state) => ({
        song: state.songs[state.currentlyPlaying.id] ? state.songs[state.currentlyPlaying.id][0] : {}
    })
)(({ song }) => (
    <Text>
        Playing { song.uri ? streamUrl(song.uri)  : ''}
    </Text>
));
