'use strict';

const iosLaunchScreenDirectory = './ios/ShoutemApp/Images.xcassets/Image.imageset/';
const iosAppIconDirectory = './ios/ShoutemApp/Images.xcassets/AppIcon.appiconset/';

module.exports = {
  launchScreen: {
    images: [{
      savePath: `${iosLaunchScreenDirectory}background.png`,
      width: 1080,
      height: 1920,
    }],
  },
  appIcon: {
    images: [{
      savePath: `${iosAppIconDirectory}icon-1.png`,
      width: 40,
      height: 40,
    }, {
      savePath: `${iosAppIconDirectory}icon-2.png`,
      width: 60,
      height: 60,
    }, {
      savePath: `${iosAppIconDirectory}icon-3.png`,
      width: 58,
      height: 58,
    }, {
      savePath: `${iosAppIconDirectory}icon-4.png`,
      width: 87,
      height: 87,
    }, {
      savePath: `${iosAppIconDirectory}icon-5.png`,
      width: 80,
      height: 80,
    }, {
      savePath: `${iosAppIconDirectory}icon-6.png`,
      width: 120,
      height: 120,
    }, {
      savePath: `${iosAppIconDirectory}icon-7.png`,
      width: 120,
      height: 120,
    }, {
      savePath: `${iosAppIconDirectory}icon-8.png`,
      width: 180,
      height: 180,
    }],
  },
};
