
import { combineReducers } from 'redux';
import messages from './messages';

const chatApp = combineReducers({
    messages
});

export default chatApp;
