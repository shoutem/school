'use strict';

const _ = require('lodash');
const path = require('path');
const spawn = require('child-process-promise').spawn;
const fs = require('fs-extra');
const isWindows = require('../helpers/is-windows');

const buildHandlers = {
  ios() {
    return spawn('xcodebuild', [
      'archive',
      '-workspace', 'ios/ShoutemApp.xcworkspace',
      '-scheme', 'ShoutemApp',
      '-configuration', this.config.configuration || 'Release',
      '-archivePath', `${path.join(this.getOutputDirectory(), 'ShoutemApp.xcarchive')}`,
      'CODE_SIGNING_REQUIRED=NO',
      'CODE_SIGN_IDENTITY=',
    ], {
      stderr: 'inherit',
      stdio: 'inherit',
    }).then(() =>
      spawn('xcodebuild', [
        '-exportArchive',
        '-exportFormat',
        'ipa',
        '-archivePath',
        `${path.join(this.getOutputDirectory(), 'ShoutemApp.xcarchive')}`,
        '-exportPath',
        `${path.join(this.getOutputDirectory(), 'ShoutemApp.ipa')}`,
      ], { stderr: 'inherit', stdio: 'inherit' }));
  },
  android() {
    const gradlew = isWindows() ? 'gradlew' : './gradlew';
    return spawn(gradlew, ['assembleUnsignedRelease'], {
      cwd: 'android',
      stdio: 'inherit',
      stderr: 'inherit',
    }).then(() => {
      console.log(`Copying .apk to ${this.getOutputDirectory()}`);
      const apkPath = path.join('android', 'app', 'build', 'outputs', 'apk');
      fs.copySync(apkPath, this.getOutputDirectory());
    });
  },
};

class AppBuilder {
  constructor(config) {
    this.config = _.assign({}, config);
  }

  getOutputDirectory() {
    return this.config.outputDirectory || path.join('temp', `${this.config.appId}`);
  }

  build() {
    return buildHandlers[this.config.platform].bind(this)();
  }
}

module.exports = AppBuilder;
