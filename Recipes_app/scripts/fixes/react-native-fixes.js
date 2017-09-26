const fs = require('fs-extra');
const _ = require('lodash');

/**
 * Copies files with fixes before official release
 * With each react-native version check fixes/fixes.json and verify if issue is resolved
 */
function applyReactNativeFixes() {
  return fs.readJson('./scripts/fixes/fixes.json')
    .then(fixes => {
      if (_.isEmpty(fixes)) {
        return Promise.resolve();
      }

      return Promise.all(fixes.map(fix => {
        console.log(`Applying fix: ${fix.from} > ${fix.to}`);
        return fs.copy(fix.from, fix.to);
      }));
    });
}

module.exports = applyReactNativeFixes;
