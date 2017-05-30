
import React from 'react';
import { connect } from 'react-redux';

export const Controls = connect(
    (state) => ({
        paused: state.currentlyPlaying.paused
    })
)(({ dispatch }) => (
    <View styleName="horizontal space-between" style={{paddingTop: 30}}>
        <Icon name="left-arrow" onPress={() => dispatch(playPreviousSong())} />

        {paused
         ? <Icon name="play" onPress={() => dispatch(playCurrentSong())}/>
         : <Icon name="pause" onPress={() => dispatch(pauseCurrentSong())} />
         }

        <Icon name="right-arrow" onPress={() => dispatch(playNextSong())} />
    </View>
))
