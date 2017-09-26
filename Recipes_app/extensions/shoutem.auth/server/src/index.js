import SettingsPage from './settingsPage/components/Settings';
import ProvidersPage from './providersPage/components/Providers';
import reducer from './reducer';
import { createDenormalizer } from 'denormalizer';
import { store } from 'context';

const adminPages = {
  SettingsPage,
  ProvidersPage
};

export {
  adminPages,
  reducer
};

createDenormalizer(store.getState);
