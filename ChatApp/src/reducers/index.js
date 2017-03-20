
import { combineReducers } from 'redux';

import chatroom from './chatroom';
import messages from './messages';

/*
{
   chatroom: {
      messages: [],
   meta: {
      isFetching: false,
      lastFetched: ...
   }
    }
   }
}
*/

const chatApp = combineReducers({
    chatroom
});

export default chatApp;
