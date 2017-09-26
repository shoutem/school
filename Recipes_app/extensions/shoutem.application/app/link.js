
const fs = require('fs-extra');
const exec = require('child_process').execSync;

const rnCli = 'node node_modules/react-native/local-cli/cli.js link';

// Android permissions
const androidManifestPath = 'android/app/src/main/AndroidManifest.xml';
const androidManifest = fs.readFileSync(androidManifestPath, 'utf8');

const searchTag = '' +
  '<uses-permission android:name="android.permission.INTERNET" />';
const replacementTag = '' +
  '<uses-permission android:name="android.permission.INTERNET" />\n' +
  '<uses-permission android:name="android.permission.BLUETOOTH"/>\n';

const newAndroidManifest = androidManifest.replace(searchTag, replacementTag);

console.log('Adding Internet & Bluetooth permissions to Android manifest');
fs.writeFileSync(androidManifestPath, newAndroidManifest, 'ascii');

exec(`${rnCli} react-native-device-info`);
