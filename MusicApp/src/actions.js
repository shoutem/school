
import { ReactNativeAudioStreaming } from 'react-native-audio-streaming';
import { DeviceEventEmitter } from 'react-native';

const Sound = require('react-native-sound');

import { search, streamUrl } from './soundcloudHelper';


export const playingGenre = (genre) => ({
    type: 'PLAYING_GENRE',
    genre
});

export const playGenre = (genre) => {
    return function (dispatch) {
        dispatch(playingGenre(genre));

        search(genre.name)
          .then(result => {
              dispatch(foundSongs(result.collection, genre));

              dispatch(playSong(result.collection[0]));
          });
    }
};

export const foundSongs = (songs, genre) => ({
    type: 'FOUND_SONGS',
    songs,
    genre
});

const testAudio = require('./media/advertising.mp3');

export const playSong = (song) => {
    return function (dispatch) {
        //const url = streamUrl(song.uri);

        Sound.setCategory('Ambient', true);

        //console.log(testAudio);

        const playSoundLooped = () => {
            const s = new Sound(testAudio, (e) => {
                if (e) {
                    console.log('error', e);
                }
                s.setNumberOfLoops(-1);
                s.play();
            });
        };

        playSoundLooped();
    }
}
