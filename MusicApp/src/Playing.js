
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, Spinner, Card, Subtitle, Icon, View } from '@shoutem/ui';
import MusicControl from 'react-native-music-control';
import Video from 'react-native-video';

import { streamUrl } from './soundcloudHelper';
import {
    playCurrentSong,
    pauseCurrentSong,
    playNextSong,
    playPreviousSong
} from './actions';

class Playing extends Component {
    get song() {
        const { songs, currentlyPlaying } = this.props;

        let song = null;

        if (currentlyPlaying.genre && currentlyPlaying.songIndex >= 0) {
            if (songs[currentlyPlaying.genre.id]) {
                song = songs[currentlyPlaying.genre.id][currentlyPlaying.songIndex];
            }
        }

        return song;
    }

    componentDidMount() {
        const { dispatch } = this.props;

        MusicControl.on('play', () => dispatch(playCurrentSong()));
        MusicControl.on('pause', () => dispatch(pauseCurrentSong()));
        MusicControl.on('nextTrack', () => dispatch(playNextSong()));
        MusicControl.on('previousTrack', () => dispatch(playPreviousSong()));
    }

    componentDidUpdate() {
        const { dispatch } = this.props,
              song = this.song;

        if (song) {
            MusicControl.setNowPlaying({
                title: song.title || "",
                artwork: song.artwork_url || "",
                artist: song.user.username || "",
                genre: song.genre || genre.name,
                duration: song.duration,
                description: song.description || "",
                color: 0xFFFFFFF,
                date: song.created_at,
                rating: true
            });
            MusicControl.enableControl('seekForward', false);
            MusicControl.enableControl('seekBackward', false);
            MusicControl.enableControl('skipForward', false);
            MusicControl.enableControl('skipBackward', false);
            MusicControl.enableBackgroundMode(true);
        }
    }

    onProgress = ({ currentTime }) => {
        MusicControl.updatePlayback({
            state: MusicControl.STATE_PLAYING,
            elapsedTime: currentTime
        })
    }

    render() {
        const { currentlyPlaying: { paused } } = this.props,
              { dispatch } = this.props;

        if (this.song) {
            return (
                <Card style={{height: 85, alignItems: "center"}}>
                    <Video source={{uri: streamUrl(this.song.uri) }}
                           ref="audio"
                           volume={1.0}
                           muted={false}
                           paused={paused}
                           playInBackground={true}
                           playWhenInactive={true}
                           onLoad={() => console.log('loaded') }
                           onProgress={this.onProgress}
                           onEnd={() => dispatch(playNextSong())}
                           resizeMode="cover"
                           repeat={false}/>

                    <View styleName="horizontal space-between">
                        <Icon name="left-arrow" onPress={() => dispatch(playPreviousSong())} />

                        {paused
                         ? <Icon name="play" onPress={() => dispatch(playCurrentSong())}/>
                         : <Icon name="pause" onPress={() => dispatch(pauseCurrentSong())} />
                         }

                        <Icon name="right-arrow" onPress={() => dispatch(playNextSong())} />
                    </View>
                </Card>
            )
        }else{
            return (
                <Card style={{height: 85, alignItems: "center"}}>
                    <Spinner />
                </Card>
            );
        }
    }
}

export default connect(
    (state) => ({
        currentlyPlaying: state.currentlyPlaying,
        songs: state.songs
    })
)(Playing);
