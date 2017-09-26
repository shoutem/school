'use strict';
const _ = require('lodash');

function getErrorMessageFromResponse(response) {
  const body = JSON.parse(_.get(response, 'body'));

  if (_.isEmpty(body) || _.isEmpty(body.errors)) {
    return '';
  }

  return _.reduce(body.errors, (message, error) => `${message}${error.title} ${error.detail} `, '');
}

module.exports = getErrorMessageFromResponse;
