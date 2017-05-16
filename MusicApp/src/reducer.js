
import { combineReducers } from 'redux';

const initialState = {
    genres: ["Alternative Rock", "Ambient", "Classical", "Country", "EDM",
             "Dancehall", "Deep House", "Disco", "Drum & Bass", "Dubstep", "Electronic",
             "Folk", "Singer-Songwriter", "Rap", "House", "Indie", "Jazz & Blues",
             "Latin", "Metal", "Piano", "Pop", "R&B & Soul", "Reggae", "Reggaeton",
             "Rock", "Soundtrack", "Techno", "Trance", "Trap", "Triphop"].map(
                 (name, i) => ({
                     id: i,
                     name
                 })
             ),
    currentlyPlaying: {
        id: null,
        name: null
    },
    songs: {}
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'PLAYING_GENRE':
            return Object.assign({}, state,
                                 {
                                     currentlyPlaying: action.genre
                                 });
        case 'FOUND_SONGS':
            const { songs, genre } = action;
            return Object.assign({}, state,
                                 {
                                     songs: Object.assign({}, state.songs,
                                                          {
                                                              [genre.id]: songs
                                                          })
                                 })
        default:
            return state;
    }
};

export default rootReducer;
