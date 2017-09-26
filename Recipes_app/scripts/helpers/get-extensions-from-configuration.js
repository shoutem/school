'use strict';
const _ = require('lodash');

function getExtensionsFromConfiguration(configuration) {
  const includedObjects = _.get(configuration, 'included', []);
  return _.filter(includedObjects, { type: 'shoutem.core.extensions' });
}

module.exports = getExtensionsFromConfiguration;
