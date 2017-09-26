/* eslint global-require: "off" */
/* global require needs to be enabled because files to be required are
 * determined dynamically
 */
'use strict';

const spawn = require('child-process-promise').spawn;
const spawnSync = require('child_process').spawnSync;
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const _ = require('lodash');
const rimraf = require('rimraf');
const process = require('process');
const request = require('request');
const colors = require('colors');

const AppBinaryConfigurator = require('./app-binary-configurator');
const getLocalExtensions = require('./../helpers/get-local-extensions');
const ExtensionsInstaller = require('./extensions-installer.js');
const buildApiEndpoint = require('./../helpers/build-api-endpoint');
const getExtensionsFromConfiguration = require('./../helpers/get-extensions-from-configuration');
const getErrorMessageFromResponse = require('../helpers/get-error-message-from-response');
const applyReactNativeFixes = require('./../fixes/react-native-fixes');

const npm = require('../services/npm');

const reactNativeCli = path.join('node_modules', 'react-native', 'local-cli', 'cli.js');

function rewritePackagerDefaultsJs() {
  const defaultsJsPath = path.join('node_modules', 'react-native', 'packager', 'defaults.js');
  const PACKAGER_DEFAULTS_JS_PATH = path.resolve(defaultsJsPath);
  const defaultsReplacePlaceholder = 'exports.providesModuleNodeModules = [';
  const defaultsContent = fs.readFileSync(PACKAGER_DEFAULTS_JS_PATH, 'utf8');
  const nodeModules = `${defaultsReplacePlaceholder}\n  '.*',`;
  const rewrittenDefaultsContent = defaultsContent.replace(defaultsReplacePlaceholder, nodeModules);
  fs.writeFileSync(PACKAGER_DEFAULTS_JS_PATH, rewrittenDefaultsContent, 'utf8');
}

/**
 * AppConfigurator configure application for running other steps (app bundling, run or build)
 * It installs extensions and adds native dependencies and static assets to main project
 * @param  {Object} config
 *  {
 *      @key Number appId
 *      @key String serverApiEndpoint
 *      @key boolean debug builds debug build
 *      @key String configurationFilePath path to where app configuration should be saved
 *      @key String extensionsDir local extensions directory
 *      @key String extensionsJsPath path to extension.js
 *  }
 */
class AppConfigurator {
  constructor(config) {
    this.buildConfig = _.assign({}, config);
  }

  getConfigurationUrl() {
    const serverApiEndpoint = this.buildConfig.serverApiEndpoint;
    const appId = this.buildConfig.appId;
    const production = this.buildConfig.production;
    const apiPath = 'configurations/current';

    return buildApiEndpoint(serverApiEndpoint, appId, apiPath, production);
  }

  downloadConfiguration() {
    console.time('Download configuration'.bold.green);
    return new Promise((resolve, reject) => {
      request.get({
        url: this.getConfigurationUrl(),
        headers: {
          Accept: 'application/vnd.api+json',
          Authorization: `Bearer ${this.buildConfig.authorization}`,
        },
      }, (error, response, body) => {
        if (response.statusCode === 200) {
          const configuration = JSON.parse(body);
          console.timeEnd('Download configuration'.bold.green);
          this.configuration = configuration;
          resolve(configuration);
        } else {
          const errorMessage = getErrorMessageFromResponse(response);
          reject(`Configuration download failed! Error: ${response.statusCode} - ${errorMessage}`.bold.red);
        }
      }).on('error', err => {
        reject(err);
      });
    });
  }

  prepareExtensions() {
    const extensions = getExtensionsFromConfiguration(this.configuration);
    const linkedExtensions = getLocalExtensions(this.buildConfig.linkedExtensions);
    // npm link all extensions all extension available locally and installed in app configuration
    const localExtensions = _.filter(linkedExtensions, (localExt) =>
      _.find(extensions, { id: localExt.id })
    );
    const extensionsJsPath = this.buildConfig.extensionsJsPath;
    // install as .tars all extensions that are not available locally
    const extensionsToInstall = extensions
      .filter(ext => !_.some(localExtensions, { id: ext.id }));

    const installer = new ExtensionsInstaller(
      localExtensions,
      extensionsToInstall,
      extensionsJsPath
    );

    return installer.installExtensions(this.buildConfig.production)
      .then((installedExts) => {
        const extensionsJs = installer.createExtensionsJs(installedExts);
        const preBuild = this.executeBuildLifecycleHook(installedExts, 'preBuild');
        let installNativeDependencies;

        if (!this.buildConfig.skipNativeDependencies) {
          installNativeDependencies = installer.installNativeDependencies(installedExts)
            .then(() => this.runReactNativeLink())
            .then(() => {
              const appBinaryConfigurator = new AppBinaryConfigurator(this.buildConfig);
              return appBinaryConfigurator.configureApp();
            });
        }

        return Promise.all([extensionsJs, preBuild, installNativeDependencies]);
      });
  }

  executeBuildLifecycleHook(extensions, lifeCycleStep) {
    console.log('Running', lifeCycleStep.bold, 'for all extensions');
    console.time(`${lifeCycleStep}`);
    _.forEach(extensions, (extension) => {
      if (extension && extension.id) {
        try {
          const build = require(path.join(extension.id, 'build.js'));
          const buildLifeCycle = _.get(build, lifeCycleStep);
          if (_.isFunction(buildLifeCycle)) {
            const initialWorkingDirectory = process.cwd();
            // run extension build hook in its own folder
            console.time(`[running ${lifeCycleStep}] - ${extension.id}`);
            process.chdir(path.join('node_modules', extension.id));
            buildLifeCycle(this.configuration, this.buildConfig);
            // return to the build script original working directory
            console.timeEnd(`[running ${lifeCycleStep}] - ${extension.id}`);
            process.chdir(initialWorkingDirectory);
          }
        } catch (e) {
          if (e.code !== 'MODULE_NOT_FOUND') {
            console.log(e);
            process.exit(1);
          }
        }
      }
    });
    console.timeEnd(`${lifeCycleStep}`);
    return Promise.resolve();
  }

  removeBabelrcFiles() {
    console.time('Removing .babelrc files'.bold.green);

    rimraf.sync(path.join('.', 'node_modules', '*', '.babelrc'));

    console.timeEnd('Removing .babelrc files'.bold.green);
    console.log('');
  }

  cleanTempFolder() {
    console.time('Cleaning temp files'.bold.green);
    rimraf.sync(path.join('.', 'temp', '*'));
    console.timeEnd('Cleaning temp files'.bold.green);
  }

  prepareConfiguration() {
    if (this.buildConfig.offlineMode) {
      const configuration = require(path.resolve(this.buildConfig.configurationFilePath));
      this.configuration = configuration;
      // Nothing to do, resolve to proceed with next build step
      return Promise.resolve(configuration);
    }
    return this.downloadConfiguration();
  }

  buildExtensions() {
    return this.prepareExtensions().then(() => this.removeBabelrcFiles());
  }

  runReactNativeLink(packageName = '', sync) {
    console.log(`react-native link ${packageName}`);
    if (sync) {
      return spawnSync('node', [reactNativeCli, 'link', packageName], { stdio: ['ignore', 'inherit', 'inherit'], cwd: process.cwd() });
    }
    return spawn('node', [reactNativeCli, 'link', packageName], { stdio: ['ignore', 'inherit', 'inherit'], cwd: process.cwd() });
  }

  linkPackages() {
    [].concat(this.buildConfig.linkedPackages).forEach((linkedPackage) => {
      const paths = glob.sync(path.join(linkedPackage, 'package.json'));
      paths.forEach((packageJsonPath) => {
        const packagePath = path.dirname(packageJsonPath);
        console.log(`npm link ${packagePath}`.bold);
        npm.link(packagePath, process.cwd());
      });
    });
  }

  run() {
    console.time('Build time'.bold.green);
    console.log('Starting build for app', `${this.buildConfig.appId}`.bold.cyan);
    // clear any previous build's temp files
    this.cleanTempFolder();
    return this.prepareConfiguration()
      .then(() => this.buildExtensions())
      .then(() => this.linkPackages())
      .then(() => {
        rewritePackagerDefaultsJs();
        console.timeEnd('Build time'.bold.green);
      })
      .then(() => applyReactNativeFixes())
      .catch((e) => {
        console.log(e);
        process.exit(1);
      });
  }
}

module.exports = AppConfigurator;
