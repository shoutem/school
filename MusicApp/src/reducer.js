
import { combineReducers } from 'redux';

const initialState = {
    genres: ["Alternative Rock", "Ambient", "Classical", "Country", "EDM",
             "Dancehall", "Deep House", "Disco", "Drum & Bass", "Dubstep", "Electronic",
             "Folk", "Singer-Songwriter", "Rap", "House", "Indie", "Jazz & Blues",
             "Latin", "Metal", "Piano", "Pop", "R&B & Soul", "Reggae", "Reggaeton",
             "Rock", "Soundtrack", "Techno", "Trance", "Trap", "Triphop"].map(
                 name => ({ name })
             )
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        default:
            return state;
    }
};

export default rootReducer;
