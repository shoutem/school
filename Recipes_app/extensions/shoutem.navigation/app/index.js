import Drawer from './screens/Drawer';
import TabBar from './screens/TabBar';
import IconGrid from './screens/IconGrid';
import Modal from './screens/Modal';
import List from './screens/List';
import CardList from './screens/CardList';
import None from './screens/None';
import Tab from './screens/Tab';
import NoScreens from './screens/NoScreens';

import reducer, {
  middleware,
} from './redux';

export const screens = {
  TabBar,
  Tab,
  Drawer,
  None,
  NoScreens,
  IconGrid,
  List,
  CardList,
  Modal,
};

export const actions = {};

export {
  reducer,
  middleware,
};

export {
  appWillMount,
  appDidMount,
} from './app';

export { createSubNavigationScreen } from './helpers';

export { default as CardList } from './components/CardList';
export { default as FolderBase } from './components/FolderBase';
export { default as IconGrid } from './components/IconGrid';
export { default as List } from './components/List';

export { NavigationBaseItem } from './components/NavigationBaseItem';
