import * as _ from 'lodash';
import { getConfiguration } from '../redux';

export function getFirstShortcut(state) {
  const configuration = getConfiguration(state);
  return _.get(configuration, 'navigation[0]');
}
