// Constants `screens`, `actions` and `reducer` are exported via named export
// It is important to use those exact names

import {
  RewardsSettingsPage,
  LoyaltySettingsPage,
  PointsCardSettingsPage,
} from './pages';
import { cmsApi } from './modules/cms';

import reducer from './redux';

export const pages = {
  RewardsSettingsPage,
  LoyaltySettingsPage,
  PointsCardSettingsPage,
};

let pageReducer = null;

export function pageWillMount(page) {
  cmsApi.initSession(page);
  pageReducer = reducer();
}

export { pageReducer as reducer };
