const fs = require('fs-extra');

const ANDROID_MANIFEST_PATH = 'android/app/src/main/AndroidManifest.xml';

const androidManifest = fs.readFileSync(ANDROID_MANIFEST_PATH, 'utf8');
const locationPermission = '<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />';
const replacementTag = '<uses-permission android:name="android.permission.INTERNET" />';

const replacement =
  `${locationPermission}
    ${replacementTag}`;
const newAndroidManifest = androidManifest.replace(replacementTag, replacement);

console.log('[shoutem-cms] - Adding ACCESS_FINE_LOCATION permission to AndroidManifest.xml');

fs.writeFileSync(ANDROID_MANIFEST_PATH, newAndroidManifest, 'ascii');

