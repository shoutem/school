
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
    playPreviousSong,
    updatePlayTime
} from './actions';
import SoundCloudWave from './SoundCloudWave';
import Controls from './Controls';
import Timer from './Timer';

class Player extends Component {
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

    get percentPlayed() {
        const { currentlyPlaying: { currentTime } } = this.props;

        return currentTime / (this.song.full_duration/1000);

    }

    componentDidMount() {
        const { dispatch } = this.props;

        MusicControl.enableControl('seekForward', false);
        MusicControl.enableControl('seekBackward', false);
        MusicControl.enableControl('skipForward', false);
        MusicControl.enableControl('skipBackward', false);
        MusicControl.enableBackgroundMode(true);

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
                genre: song.genre || "",
                duration: song.duration/1000,
                description: song.description || "",
                color: 0xFFFFFFF,
                date: song.created_at,
                rating: true
            });
        }
    }

    onPlayProgress = ({ currentTime }) => {
        dispatch(updatePlayTime(currentTime))
    }

    onPlayEnd = () => {
        dispatch(playNextSong())
    }

    render() {
        const { currentlyPlaying: { paused, currentTime } } = this.props,
              { dispatch } = this.props;

        if (!this.song) {
            return (
                <Card style={{height: 85, alignItems: "center"}}>
                    <Spinner />
                </Card>
            );
        }

        return (
            <Card style={{height: 85, alignItems: 'center'}}>
                <Video source={{uri: streamUrl(this.song.uri) }}
                       ref="audio"
                       volume={1.0}
                       muted={false}
                       paused={paused}
                       playInBackground={true}
                       playWhenInactive={true}
                       onProgress={this.onPlayProgress}
                       onEnd={this.onPlayEnd}
                       resizeMode="cover"
                       repeat={false}/>

                <View style={{position: 'absolute', top: 0, height: 85}}>
                    <SoundCloudWave song={this.song} width={180} height={85}
                                    percent={this.percentPlayed}/>
                </View>

                <View style={{position: 'absolute', top: 0, height: 85, alignItems: 'center'}}>
                    <Controls />

                    <Timer currentTime={currentTime} />
                </View>
            </Card>
        );
    }
}

export default connect(
    (state) => ({
        currentlyPlaying: state.currentlyPlaying,
        songs: state.songs
    })
)(Player);
