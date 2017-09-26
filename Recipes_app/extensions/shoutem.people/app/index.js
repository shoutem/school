// Constants `screens`, `actions` and `reducer` are exported via named export
// It is important to use those exact names

import reducer from './reducers';
import PeopleListScreen from './screens/PeopleListScreen';
import PeopleDetailsScreen from './screens/PeopleDetailsScreen';

export const screens = {
  PeopleListScreen,
  PeopleDetailsScreen,
};

export { reducer };

