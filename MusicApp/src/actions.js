
import { search } from './soundcloudHelper';

export const playingGenre = (genre) => ({
    type: 'PLAYING_GENRE',
    genre
});

export const playGenre = (genre) => {
    return function (dispatch) {
        dispatch(playingGenre(genre));

        search(genre.name)
          .then(result => dispatch(foundSongs(result.collection, genre)));
    }
};

export const foundSongs = (songs, genre) => ({
    type: 'FOUND_SONGS',
    songs,
    genre
});
