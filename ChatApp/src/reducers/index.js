
import { combineReducers } from 'redux';

import chatroom from './chatroom';
import user from './user';

const rootReducer = combineReducers({
    chatroom,
    user
});

export default rootReducer;
