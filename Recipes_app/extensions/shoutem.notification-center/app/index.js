import NotificationsList from './screens/NotificationsList';
import PushGroupsList from './screens/PushGroupsList';

import {
  middleware,
  reducer,
} from './redux';

const screens = {
  NotificationsList,
  PushGroupsList,
};

export {
  middleware,
  screens,
  reducer,
};

export { appDidMount } from './app';
