'use strict';

const _ = require('lodash');
const fs = require('fs-extra');
const request = require('request');
const plist = require('plist');
const Jimp = require('jimp');
const colors = require('colors');

const getErrorMessageFromResponse = require('../helpers/get-error-message-from-response');

const iosBinarySettings = require('../configs/iosBinarySettings');
const androidBinarySettings = require('../configs/androidBinarySettings');
const binarySettings = {
  ios: iosBinarySettings,
  android: androidBinarySettings,
};

function downloadImage(imageUrl, savePath) {
  return new Promise((resolve, reject) => {
    request(imageUrl)
      .pipe(fs.createWriteStream(savePath))
      .on('error', () => reject())
      .on('finish', () => resolve(savePath));
  });
}

/**
 * Downloads image to downloadPath and saves resized images
 * to savePath defined in resizeConfig.
 * @param {string} imageUrl - URL of the image to be downloaded
 * @param {string} downloadPath - Path where original image would be located after download
 * @param {Object} resizeConfig - Object with definition of resulting images
 * @param {Array} resizeConfig.images - Array of image object where image is defined by
 * object: { savePath: {string}, width: {number}, height: {number} }
 * @returns {*|Promise.<TResult>|Promise<T>}
 */
function downloadAndResizeImage(imageUrl, downloadPath, resizeConfig, production) {
  return downloadImage(imageUrl, downloadPath, resizeConfig).then((imagePath) => {
    const resizingPromises = _.map(resizeConfig.images, (image) =>
      new Promise((resolve, reject) => {
        Jimp.read(imagePath)
          .then((imageFile) =>
            imageFile
              .cover(image.width, image.height)
              .write(image.savePath)
          )
          .then(() => resolve())
          .catch((error) => {
            if (production) {
              reject(error);
            }
            resolve();
          });
      })
    );

    return Promise.all(resizingPromises);
  });
}

class AppBinaryConfigurator {
  constructor(config) {
    this.config = _.assign({}, config);
    this.configureLaunchScreen = this.configureLaunchScreen.bind(this);
    this.configureAppIcon = this.configureAppIcon.bind(this);
    this.configureAppInfo = this.configureAppInfo.bind(this);
  }

  getLegacyApiHost() {
    if (!this.config.legacyApiEndpoint) {
      process.exitCode = 1;
      throw new Error('legacyApiEndpoint is not set in build config.');
    }
    return this.config.legacyApiEndpoint;
  }

  getPublishingProperties() {
    return new Promise((resolve, reject) => {
      request.get({
        url: `http://${this.getLegacyApiHost()}/api/applications/publishing_properties.json?nid=${this.config.appId}`,
        headers: {
          Authorization: `Bearer ${this.config.authorization}`,
        },
      }, (error, response, body) => {
        if (response.statusCode === 200) {
          this.publishingProperties = JSON.parse(body);
          resolve();
        } else {
          console.log(response);
          const errorMessage = getErrorMessageFromResponse(response);
          reject(`Publishing info download failed with error: ${response.statusCode} ${errorMessage}`.bold.red);
        }
      }).on('error', err => {
        reject(err);
      });
    });
  }

  getLaunchScreenUrl() {
    // uploading launch image in builder only sets this image, so we are using it on both platforms
    return this.publishingProperties.iphone_launch_image_portrait;
  }

  configureLaunchScreen(settings, platform) {
    console.log('Configuring', `${platform}`.bold, 'launch screen...');
    const launchScreen = this.getLaunchScreenUrl(platform);
    const resizeConfig = settings.launchScreen;
    const production = this.config.production;
    const launchScreenPath = './assets/launchScreen.png';
    return downloadAndResizeImage(launchScreen, launchScreenPath, resizeConfig, production);
  }

  getAppIconUrl() {
    // TODO (Ivan): Change this when android icon is available in publishing properties
    return this.publishingProperties.iphone_application_icon_hd_ios7;
  }

  configureAppIcon(settings, platform) {
    console.log('Configuring', `${platform}`.bold, 'app icons');
    const appIcon = this.getAppIconUrl(platform);
    const resizeConfig = settings.appIcon;
    const production = this.config.production;
    return downloadAndResizeImage(appIcon, './assets/appIcon.png', resizeConfig, production);
  }

  getBinaryVersionName() {
    // we fallback to default one so CLI doesn't have to handle version
    return this.config.binaryVersionName || '5.0.0';
  }

  getBinaryVersionCode() {
    // we fallback to default one so CLI doesn't have to handle version
    return this.config.binaryVersionCode || 1;
  }

  configureAppInfoIOS() {
    console.log('Configuring', 'Info.plist'.bold);
    const infoPlistPath = './ios/ShoutemApp/Info.plist';
    const infoPlistFile = fs.readFileSync(infoPlistPath, 'utf8');
    const infoPlist = plist.parse(infoPlistFile);
    // we use this prefix for e.g. building apps with wildcard application identifier
    const bundlePrefix = this.config.bundleIdPrefix ? `${this.config.bundleIdPrefix}.` : '';
    let bundleId;

    if (this.config.iosBundleId) {
      bundleId = this.config.iosBundleId;
    } else {
      bundleId = this.config.production ? this.publishingProperties.iphone_bundle_id : 'com.shoutem.ShoutemApp';
    }

    infoPlist.CFBundleName = this.publishingProperties.iphone_name;
    infoPlist.CFBundleDisplayName = this.publishingProperties.iphone_name;
    infoPlist.CFBundleIdentifier = `${bundlePrefix}${bundleId}`;
    infoPlist.CFBundleShortVersionString = this.getBinaryVersionName();
    infoPlist.LSApplicationCategoryType = this.publishingProperties.primary_category_name;
    fs.writeFileSync(infoPlistPath, plist.build(infoPlist));
  }

  configureAppInfoAndroid() {
    console.log('Configuring', 'build.gradle'.bold);
    const buildGradlePath = './android/app/build.gradle';
    const buildGradle = fs.readFileSync(buildGradlePath, 'utf8');
    let applicationId;

    if (this.config.androidApplicationId) {
      applicationId = this.config.androidApplicationId;
    } else {
      applicationId = this.config.production ? this.publishingProperties.android_market_package_name : 'com.shoutemapp';
    }

    const newBuildGradle = buildGradle
      .replace(/\sapplicationId\s.*/g, ` applicationId '${applicationId}'`)
      .replace(/\sversionCode\s.*/g, ` versionCode ${this.getBinaryVersionCode()}`)
      .replace(/\sversionName\s.*/g, ` versionName '${this.getBinaryVersionName()}'`)
      .replace(/ShoutemApplicationName/g, this.publishingProperties.android_name);
    fs.writeFileSync(buildGradlePath, newBuildGradle);
  }

  configureAppInfo(settings, platform) {
    if (platform === 'ios') {
      this.configureAppInfoIOS();
    } else if (platform === 'android') {
      this.configureAppInfoAndroid();
    }

    return Promise.resolve();
  }

  runForAllPlatforms(configureFunction) {
    return Promise.all(_.map(binarySettings, (settings, platform) => {
      if (_.isFunction(configureFunction)) {
        configureFunction(settings, platform);
      }
    }));
  }

  configureApp() {
    return this.getPublishingProperties()
      .then(() => this.runForAllPlatforms(this.configureLaunchScreen))
      .then(() => this.runForAllPlatforms(this.configureAppIcon))
      .then(() => this.runForAllPlatforms(this.configureAppInfo));
  }
}

module.exports = AppBinaryConfigurator;
