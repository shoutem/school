import IconsPage from './iconsPage/IconsPage';
import List from './layoutSettings/list/List';
import CardList from './layoutSettings/cardList/CardList';
import None from './layoutSettings/None';
import IconGrid from './layoutSettings/iconGrid/IconGrid';
import Drawer from './layoutSettings/Drawer';
import TabBar from './layoutSettings/Tabbar';
import NavigationBarPage from './NavigationBarPage';

import reducer from './reducer';
import { createDenormalizer } from 'denormalizer';
import { store } from 'context';

const adminPages = {
  IconsPage,
  List,
  CardList,
  None,
  IconGrid,
  Drawer,
  TabBar,
  NavigationBarPage,
};

export {
  adminPages,
  reducer,
};

createDenormalizer(store.getState);
