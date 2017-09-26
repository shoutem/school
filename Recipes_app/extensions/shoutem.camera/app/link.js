const fs = require('fs-extra');

// iOS permissions
const plist = require('plist');
const infoPlistPath = './ios/ShoutemApp/Info.plist';
const infoPlistFile = fs.readFileSync(infoPlistPath, 'utf8');
const infoPlist = plist.parse(infoPlistFile);
const exec = require('child_process').execSync;

const rnCli = 'node node_modules/react-native/local-cli/cli.js link';

console.log('Adding camera and microphone permissions to Info.plist');
infoPlist.NSCameraUsageDescription = 'App needs your camera to be able to scan QR codes';
infoPlist.NSMicrophoneUsageDescription = 'App needs your microphone to be able to scan QR codes';
fs.writeFileSync(infoPlistPath, plist.build(infoPlist));

// Android permissions
const androidManifestPath = 'android/app/src/main/AndroidManifest.xml';
const androidManifest = fs.readFileSync(androidManifestPath, 'utf8');

const replacementTag = '' +
  '<uses-permission android:name="android.permission.INTERNET" />';

const replacement =
  `${replacementTag}`;
const newAndroidManifest = androidManifest.replace(replacementTag, replacement);

console.log('Adding Internet permissions to Android manifest');
fs.writeFileSync(androidManifestPath, newAndroidManifest, 'ascii');

exec(`${rnCli} react-native-camera`);
