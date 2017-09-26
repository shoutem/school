#!/usr/bin/env node

const _ = require('lodash');
const commandLineArgs = require('command-line-args');
const path = require('path');
const fs = require('fs-extra');
const spawn = require('superspawn').spawn;
const validateArgsWithConfig = require('./helpers/validate-args-with-config');
const reactNativeCli = path.join('node_modules', 'react-native', 'local-cli', 'cli.js');

const cli = commandLineArgs([
  { name: 'platform', type: String },
  { name: 'simulator', type: String },
  { name: 'configuration', type: String },
  { name: 'scheme', type: String },
  { name: 'device', type: String },
  { name: 'udid', type: String },
  { name: 'variant', type: String },
]);

// merge command line arguments and config.json

const cliArgs = cli.parse();
const configPath = path.resolve('config.json');
const config = fs.readJsonSync(configPath);
validateArgsWithConfig(cliArgs, config);

function getAdbPath() {
  return process.env.ANDROID_HOME
    ? process.env.ANDROID_HOME + '/platform-tools/adb'
    : 'adb';
}

const runConfig = cliArgs.platform === 'android' ?
  _.omit(cliArgs, 'platform', 'configuration') :
  _.omit(cliArgs, 'platform');

if (cliArgs.platform === 'android' && !runConfig.variant) {
  const configuration = !cliArgs.configuration ? 'Debug' : _.capitalize(cliArgs.configuration);
  runConfig.variant = `${configuration}`;
}

const reactNativeRunArguments = _.reduce(runConfig, (args, argValue, argName) => {
  if (argValue) {
    args.push(`--${argName}`);
    args.push(argValue);
  }
  return args;
}, []);

const reactNativeRun = [reactNativeCli, `run-${cliArgs.platform}`, ...reactNativeRunArguments];
console.log('node', ...reactNativeRun);
spawn('node', reactNativeRun, { stdio: 'inherit', cwd: process.cwd() })
  .then(() => {
    // TODO(Ivan): fix this in reactNativeRunAndroid.js
    // React native run android command assumes that applicationId and packageName are the same,
    // which is not the case with our app, so after successful build it fails to open the app
    if (cliArgs.platform === 'android') {
      const adbPath = getAdbPath();
      const packageName = fs.readFileSync(
        path.join('android', 'app', 'src', 'main', 'AndroidManifest.xml'),
        'utf8'
      ).match(/package="(.+?)"/)[1];
      const applicationId = fs.readFileSync(
        path.join('android', 'app', 'build.gradle'),
        'utf8'
      ).match(/applicationId\s'(.+?)'/)[1];
      return spawn(adbPath, [
        'shell', 'am', 'start', '-n', `${applicationId}/${packageName}.MainActivity`,
      ], { stdio: 'inherit' });
    }
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


