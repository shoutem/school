const _ = require('lodash');
const fs = require('fs-extra');
const plist = require('plist');
const nearestSync = require('nearest-file-path').nearestSync;

const SHOUTEM_AUTH = 'shoutem.auth';

const isAuthExtension = i => i.type === 'shoutem.core.extensions' && i.id === SHOUTEM_AUTH;

const configureFacebookSettingsIOS = (facebookAppId, facebookAppName) => {
  console.log('Configuring Facebook login settings for iOS');

  // After clone extension is placed in ./extensions/shoutem.auth/app where root directory
  // is directory of clonned app.
  // If extension failed to download by CLI it is placed directly to node_modules.
  // TODO(Ivan): Change this to write Info.plist and locally,
  // when Info.plist merging is enabled
  const infoPlistPath = nearestSync('ios/ShoutemApp/Info.plist', __dirname);

  const infoPlistFile = fs.readFileSync(infoPlistPath, 'utf8');
  const infoPlist = plist.parse(infoPlistFile);

  infoPlist.CFBundleURLTypes.push({ CFBundleURLSchemes: [`fb${facebookAppId}`] });
  infoPlist.FacebookAppID = facebookAppId;
  infoPlist.FacebookDisplayName = facebookAppName;

  fs.writeFileSync(infoPlistPath, plist.build(infoPlist));
};

const configureFacebookSettingsAndroid = (facebookAppId) => {
  console.log('Configuring Facebook login settings for Android');

  // After clone extension is placed in ./extensions/shoutem.auth/app where root directory
  // is directory of clonned app.
  // If extension failed to download by CLI it is placed directly to node_modules.
  // TODO(Ivan): Change this to write strings.xml locally,
  // when strings.xml merging is enabled
  const stringsXMLPath = nearestSync('android/app/src/main/res/values/strings.xml', __dirname);

  const stringsXML = fs.readFileSync(stringsXMLPath, 'utf8');
  const newStringsXML = stringsXML.replace(/facebook-app-id/g, facebookAppId);

  fs.writeFileSync(stringsXMLPath, newStringsXML);
};

exports.preBuild = function preBuild(appConfiguration) {
  const authExtension = _.get(appConfiguration, 'included').find(isAuthExtension);
  const facebookSettings = _.get(authExtension, 'attributes.settings.providers.facebook') || {};

  const { appId: facebookAppId, appName: facebookAppName } = facebookSettings;

  if (!(facebookAppId && facebookAppName)) {
    return;
  }

  configureFacebookSettingsIOS(facebookAppId, facebookAppName);
  configureFacebookSettingsAndroid(facebookAppId);
};
