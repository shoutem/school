
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, Spinner } from '@shoutem/ui';
import MusicControl from 'react-native-music-control';

import { streamUrl } from './soundcloudHelper';

class Playing extends Component {
    componentDidMount() {
        const { dispatch } = this.props;

        MusicControl.on('pause', () => dispatch(pauseSong()));
        MusicControl.on('nextTrack', () => { console.log('HELLO'); dispatch(playNextSong()) });
        MusicControl.on('previousTrack', () => dispatch(playPreviousSong()));
    }

    render() {
        const { songs, currentlyPlaying } = this.props;

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
    }
}

export default connect(
    (state) => ({
        currentlyPlaying: state.currentlyPlaying,
        songs: state.songs
    })
)(Playing);
