import _ from 'lodash';
import { mapReducers } from '@shoutem/redux-composers';
import { collection } from '@shoutem/redux-io';

function getFeedUrl(action) {
  return _.get(action, ['meta', 'params', 'filter[url]']);
}

const _15min = 15 * 60;

export function rssFeed(schema) {
  return mapReducers(
    getFeedUrl,
    collection(schema, undefined, { expirationTime: _15min })
  );
}
