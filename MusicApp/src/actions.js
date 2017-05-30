
import { DeviceEventEmitter } from 'react-native';
import MusicControl from 'react-native-music-control';

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
              dispatch(setCurrentSong(0));
              dispatch(playCurrentSong());
          });
    }
};

export const foundSongs = (songs, genre) => ({
    type: 'FOUND_SONGS',
    songs,
    genre
});

export const setCurrentSong = (index) => ({
    type: 'SET_CURRENT_SONG',
    index
});

const testAudio = require('./media/advertising.mp3');

export const playCurrentSong = () => ({
    type: 'UPDATE_PAUSED',
    paused: false
});

export const pauseCurrentSong = () => ({
    type: 'UPDATE_PAUSED',
    paused: true
});

export const playNextSong = () => {
    return function (dispatch, getState) {
        const { songIndex, genre } = getState().currentlyPlaying,
              songs = getState().songs[genre.id];

        dispatch(setCurrentSong((songIndex+1)%songs.length));
        dispatch(playCurrentSong());
    }
};
export const playPreviousSong = () => {
    return function (dispatch, getState) {
        const { songIndex } = getState().currentlyPlaying,
              newIndex = songIndex - 1;

        dispatch(setCurrentSong(newIndex < 0 ? 0 : newIndex));
        dispatch(playCurrentSong());
    }
}
