'use strict';

const fs = require('fs-extra');

function writeJsonToFile(json, file) {
  fs.writeJsonSync(file, json, {}, function (err) {
    console.log(`Unable to save the ${file} in the shoutem.application extension: ${err}`);
  });
}

exports.preBuild = function preBuild(appConfiguration, buildConfiguration) {
  const configuration = buildConfiguration.release ? appConfiguration : {};
  writeJsonToFile(configuration, 'configuration.json');
  writeJsonToFile(buildConfiguration, 'buildConfig.json');
}
