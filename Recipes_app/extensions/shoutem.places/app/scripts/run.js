const fs = require('fs-extra');

const androidManifestPath = 'android/app/src/main/AndroidManifest.xml';
const androidManifest = fs.readFileSync(androidManifestPath, 'utf8');
const locationPermission = '<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />';
const replacementTag = '<uses-permission android:name="android.permission.INTERNET" />';

const replacement =
  `${locationPermission}
    ${replacementTag}`;
const newAndroidManifest = androidManifest.replace(replacementTag, replacement);

console.log('[shoutem-places] - Adding ACCESS_FINE_LOCATION permission to AndroidManifest.xml');

fs.writeFileSync(androidManifestPath, newAndroidManifest, 'ascii');

