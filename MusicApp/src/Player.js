
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, Spinner, Card, Subtitle, Icon, View } from '@shoutem/ui';
import Video from 'react-native-video';

import { updatePlayTime, playNextSong } from './actions';
import { streamUrl } from './soundcloudHelper';
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

    onPlayProgress = ({ currentTime }) => {
        this.props.dispatch(updatePlayTime(currentTime))
    }

    onPlayEnd = () => {
        this.props.dispatch(playNextSong())
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
