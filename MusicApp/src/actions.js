
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

export const playCurrentSong = () => {
    return function (dispatch, getState) {
        const { songs, currentlyPlaying } = getState();

        let song = null;

        if (currentlyPlaying.genre && currentlyPlaying.songIndex >= 0) {
            if (songs[currentlyPlaying.genre.id]) {
                song = songs[currentlyPlaying.genre.id][currentlyPlaying.songIndex];
            }
        }

        MusicControl.enableControl('seekForward', false);
        MusicControl.enableControl('seekBackward', false);
        MusicControl.enableControl('skipForward', false);
        MusicControl.enableControl('skipBackward', false);
        MusicControl.enableBackgroundMode(true);

        MusicControl.on('play', () => dispatch(playCurrentSong()));
        MusicControl.on('pause', () => dispatch(pauseCurrentSong()));
        MusicControl.on('nextTrack', () => dispatch(playNextSong()));
        MusicControl.on('previousTrack', () => dispatch(playPreviousSong()));

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

            MusicControl.updatePlayback({
                state: MusicControl.STATE_PLAYING
            });
        }

        dispatch(_updatePaused(false));
    }
};

export const pauseCurrentSong = () => {
    return function (dispatch) {
        MusicControl.updatePlayback({
            state: MusicControl.STATE_PAUSED
        });

        dispatch(_updatePaused(true));
    }
};

const _updatePaused = (paused) => ({
    type: 'UPDATE_PAUSED',
    paused
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

export const updatePlayTime = (currentTime) => {
    return function (dispatch) {
        MusicControl.updatePlayback({
            state: MusicControl.STATE_PLAYING,
            elapsedTime: currentTime
        });

        dispatch(_setPlayTime(currentTime));
    }
}

const _setPlayTime = (currentTime) => ({
    type: 'SET_PLAY_TIME',
    currentTime
});
