'use strict';

const path = require('path');
const androidResourcesDirectory = './android/app/src/main/res';

module.exports = {
  launchScreen: {
    images: [{
      savePath: path.join(androidResourcesDirectory, 'drawable', 'splash.png'),
      width: 1280,
      height: 1920,
    }, {
      savePath: path.join(androidResourcesDirectory, 'drawable-hdpi', 'splash.png'),
      width: 480,
      height: 800,
    }, {
      savePath: path.join(androidResourcesDirectory, 'drawable-ldpi', 'splash.png'),
      width: 200,
      height: 320,
    }, {
      savePath: path.join(androidResourcesDirectory, 'drawable-mdpi', 'splash.png'),
      width: 320,
      height: 480,
    }, {
      savePath: path.join(androidResourcesDirectory, 'drawable-xhdpi', 'splash.png'),
      width: 720,
      height: 1280,
    }, {
      savePath: path.join(androidResourcesDirectory, 'drawable-xxhdpi', 'splash.png'),
      width: 960,
      height: 1600,
    }, {
      savePath: path.join(androidResourcesDirectory, 'drawable-xxxhdpi', 'splash.png'),
      width: 1280,
      height: 1920,
    }],
  },
  appIcon: {
    images: [{
      savePath: path.join(androidResourcesDirectory, 'mipmap-hdpi', 'ic_launcher.png'),
      width: 72,
      height: 72,
    }, {
      savePath: path.join(androidResourcesDirectory, 'mipmap-mdpi', 'ic_launcher.png'),
      width: 48,
      height: 48,
    }, {
      savePath: path.join(androidResourcesDirectory, 'mipmap-xhdpi', 'ic_launcher.png'),
      width: 96,
      height: 96,
    }, {
      savePath: path.join(androidResourcesDirectory, 'mipmap-xxhdpi', 'ic_launcher.png'),
      width: 144,
      height: 144,
    }],
  },
};
