import _ from 'lodash';

function getError(action) {
  const errors =  _.get(action, ['payload', 'response', 'errors'], []);
  return _.get(errors, '0', {});
}

export function getErrorCode(action) {
  const error = getError(action);
  return _.get(error, 'code');
}
