// Constants `screens`, `actions` and `reducer` are exported via named export
// It is important to use those exact names

import reducer from './reducers';
import MenuListScreen from './screens/MenuListScreen';
import MenuSmallListScreen from './screens/MenuSmallListScreen';
import MenuDetailsScreen from './screens/MenuDetailsScreen';

export const screens = {
  MenuListScreen,
  MenuSmallListScreen,
  MenuDetailsScreen,
};

export { reducer };

