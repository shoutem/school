
'use-strict';

const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

/**
 * Gets collection of all extension name - extension version pairs
 * from shoutem-extensions repository path
 */
function getPlatformDependencies(shoutemExtensionsPath) {
  const dependencies = {};
  const paths = glob.sync(path.join(shoutemExtensionsPath, '*'));
  paths.forEach((extensionPath) => {
    const stat = fs.statSync(extensionPath);
    if (stat && stat.isDirectory()) {
      try {
        const extensionJsonPath = path.resolve(path.join(extensionPath, 'extension.json'));
        const extensionStat = fs.statSync(extensionJsonPath);
        if (extensionStat && extensionStat.isFile()) {
          const extensionJson = fs.readJsonSync(extensionJsonPath);
          const extensionName = extensionJson.name;
          const extensionVersion = extensionJson.version;
          dependencies[`shoutem.${extensionName}`] = `~${extensionVersion}`;
        }
      } catch (error) {
        console.log(`Failed to load ${extensionPath} with error: ${error}`);
        process.exit(1);
      }
    }
  });

  return dependencies;
}

module.exports = getPlatformDependencies;
