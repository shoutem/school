'use strict';

function isWindows() {
  return /^win/.test(process.platform);
}

module.exports = isWindows;
