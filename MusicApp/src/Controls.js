
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Icon } from '@shoutem/ui';

import {
    playCurrentSong,
    pauseCurrentSong,
    playNextSong,
    playPreviousSong
} from './actions';

export default connect(
    (state) => ({
        paused: state.currentlyPlaying.paused
    })
)(({ paused, dispatch }) => (
    <View styleName="horizontal space-between" style={{paddingTop: 30}}>
        <Icon name="left-arrow" onPress={() => dispatch(playPreviousSong())} />

        {paused
         ? <Icon name="play" onPress={() => dispatch(playCurrentSong())}/>
         : <Icon name="pause" onPress={() => dispatch(pauseCurrentSong())} />
         }

        <Icon name="right-arrow" onPress={() => dispatch(playNextSong())} />
    </View>
));
