/* eslint global-require: "off" */
/* global requre needs to be enabled because files to be required are
 * determined dynamically
 */

'use-strict';

const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const _ = require('lodash');

/**
 * Gets collection of all local extensions where
 * collection item has {String} name and {String} path keys
 * @param {Array} workingDirectories array of all paths
 * that need to be watched and installed in projects' node_modules folder
 */
function getLocalExtensions(workingDirectories) {
  const results = [];
  console.time('Load local extensions'.bold.green);
  [].concat(workingDirectories).forEach((workDirPattern) => {
    const paths = glob.sync(path.join(workDirPattern, '/app'));
    paths.forEach((packagePath) => {
      const stat = fs.statSync(packagePath);
      if (stat && stat.isDirectory()) {
        try {
          const packageJsonPath = path.resolve(path.join(packagePath, 'package.json'));
          const packageStat = fs.statSync(packageJsonPath);
          if (packageStat && packageStat.isFile()) {
            const packageJson = require(packageJsonPath);
            const packageName = packageJson.name;
            const packageDependecies = packageJson.dependencies;
            results.push({
              id: packageName,
              path: packagePath,
              isNative: !_.isEmpty(packageJson.rnpm),
              dependencies: packageDependecies,
            });
          }
        } catch (error) {
          console.log(`Failed to load ${packagePath} with error:`.bold.red, `${error}`);
          process.exit(1);
        }
      }
    });
  });
  console.timeEnd('Load local extensions'.bold.green);
  return results;
}

module.exports = getLocalExtensions;
