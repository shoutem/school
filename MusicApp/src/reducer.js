
import { combineReducers } from 'redux';

const initialGenres = ["Alternative Rock", "Ambient", "Classical", "Country", "EDM",
                       "Dancehall", "Deep House", "Disco", "Drum & Bass", "Dubstep", "Electronic",
                       "Folk", "Singer-Songwriter", "Rap", "House", "Indie", "Jazz & Blues",
                       "Latin", "Metal", "Piano", "Pop", "R&B & Soul", "Reggae", "Reggaeton",
                       "Rock", "Soundtrack", "Techno", "Trance", "Trap", "Triphop"].map(
                           (name, i) => ({
                               id: i,
                               name
                           }));

const initialCurrentlyPlaying = {
    genre: {},
    songIndex: -1,
    paused: false
}

const currentlyPlaying = (state = initialCurrentlyPlaying, action) => {
    switch (action.type) {
        case 'PLAYING_GENRE':
            return Object.assign({}, state,
                                 {
                                     genre: action.genre,
                                     paused: false,
                                     currentTime: 0
                                 });
        case 'SET_CURRENT_SONG':
            return Object.assign({}, state,
                                 {
                                     songIndex: action.index
                                 });
        case 'UPDATE_PAUSED':
            return Object.assign({}, state,
                                 {
                                     paused: action.paused
                                 });
        case 'SET_PLAY_TIME':
            return Object.assign({}, state,
                                 {
                                     currentTime: action.currentTime
                                 });

        default:
            return state;
    }
}

const songs = (state = {}, action) => {
    switch (action.type) {
        case 'FOUND_SONGS':
            const { songs, genre } = action;
            return Object.assign({}, state.songs,
                                 {
                                     [genre.id]: songs
                                 })
        default:
            return state;
    }
};

const genres = (state = initialGenres, action) => {
    switch (action.type) {
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    currentlyPlaying,
    songs,
    genres
});

export default rootReducer;
