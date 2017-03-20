
import { combineReducers } from 'redux';

import messages from './messages';

const initialState = {
    isFetching: false,
    lastFetched: null
}

const meta = (state = initialState, action) => {
    switch (action.type) {
        case 'START_FETCHING_MESSAGES':
            return Object.assign({}, state, {
                isFetching: true
            });
        case 'RECEIVED_MESSAGES':
            return Object.assign({}, state, {
                isFetching: false,
                lastFetched: action.receivedAt
            });
        default:
            return state
    }
}

const chatroom = combineReducers({
    messages,
    meta
});

export default chatroom;
