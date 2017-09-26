import _ from 'lodash';
import { combineReducers } from 'redux';
import { storage, collection } from '@shoutem/redux-io';
import { schema as EVENTS_PROXY_SCHEMA} from './services/createICalSchemaConfig';
import adaptEventAttributes from './services/eventAdapter';

const eventsStorage = storage(EVENTS_PROXY_SCHEMA);
function events(state, action) {
  const storedEvents = eventsStorage(state, action);

  _.forEach(storedEvents, storedEvent => {
    if (storedEvent.attributes)
      storedEvent.attributes = adaptEventAttributes(storedEvent.attributes);
  });

  return storedEvents;
}

export default combineReducers({
  events,
  allEvents: collection(EVENTS_PROXY_SCHEMA, 'allEvents'),
});
