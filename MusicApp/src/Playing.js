
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, Spinner } from '@shoutem/ui';
import MusicControl from 'react-native-music-control';
import Video from 'react-native-video';

import { streamUrl } from './soundcloudHelper';

class Playing extends Component {
    componentDidMount() {
        const { dispatch } = this.props;

        console.log('Hai');

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
                <Video source={{uri: streamUrl(song.uri) }}
                       ref="audio"
                       volume={1.0}
                       muted={false}
                       paused={false}
                       playInBackground={true}
                       onLoad={() => console.log('loaded') }
                       onProgress={() => console.log('progress') }
                       onEnd={() => console.log('end') }
                       resizeMode="cover"
                       repeat={false}/>
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
