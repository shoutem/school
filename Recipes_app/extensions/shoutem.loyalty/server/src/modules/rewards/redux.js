import { combineReducers } from 'redux';
import _ from 'lodash';
import { getCollection, collection } from '@shoutem/redux-io';
import { updateShortcutSettings } from '@shoutem/redux-api-sdk';
import {
  loadResources,
  deleteResource,
  createCategory,
  navigateToCms,
  CATEGORIES,
} from '../cms';
import { PLACES, PLACE_REWARDS } from '../../redux';
import ext from '../../const';

// CONST
export const moduleName = 'rewards';

// SELECTORS
export function getRewardsState(state) {
  return state[moduleName];
}

export function getShortcutRewards(shortcutState, state) {
  if (!shortcutState) {
    return null;
  }

  const rewards = getRewardsState(shortcutState).rewards;
  return getCollection(rewards, state);
}

export function getShortcutPlaces(shortcutState, state) {
  if (!shortcutState) {
    return null;
  }

  const places = getRewardsState(shortcutState).places;
  return getCollection(places, state);
}

// ACTIONS
export function loadShortcutRewards(appId, categoryId, placeId, scope) {
  const filter = placeId ? { 'filter[place.id]': placeId } : null;
  return loadResources(appId, categoryId, PLACE_REWARDS, filter, ext('shortcutRewards'), scope);
}

export function loadShortcutPlaces(appId, categoryId, scope) {
  return loadResources(appId, categoryId, PLACES, {}, ext('shortcutPlaces'), scope);
}

export function deleteReward(appId, resourceId, scope) {
  return deleteResource(appId, resourceId, PLACE_REWARDS, scope);
}

export function createRewardsCategory(appId, categoryName, shortcut, scope) {
  return dispatch => (
    dispatch(createCategory(appId, PLACE_REWARDS, categoryName, scope))
      .then(categoryId => {
        const rewardsCategoryId = _.toString(categoryId);
        const settingsPatch = {
          cmsCategory: {
            id: rewardsCategoryId,
            type: CATEGORIES,
          },
        };

        return dispatch(updateShortcutSettings(shortcut, settingsPatch))
          .then(() => rewardsCategoryId);
      })
  );
}

export function openRewardsCmsEditor(appId, categoryId) {
  return navigateToCms(appId, categoryId, PLACE_REWARDS);
}

// REDUCER
export const reducer = combineReducers({
  places: collection(PLACES, ext('shortcutPlaces')),
  rewards: collection(PLACE_REWARDS, ext('shortcutRewards')),
});
