#!/usr/bin/env node

const _ = require('lodash');
const fs = require('fs-extra');
const AppBuilder = require('./classes/app-builder');
// eslint-disable-next-line import/no-unresolved
const commandLineArgs = require('command-line-args');
const path = require('path');

const cli = commandLineArgs([
  { name: 'platform', type: String },
  { name: 'outputDirectory', type: String },
  { name: 'configuration', type: String },
]);

const cliArgs = cli.parse();
const configPath = path.resolve('config.json');
const config = fs.readJsonSync(configPath);

// merge command line arguments and config.json
const buildConfig = _.merge(config, cliArgs);
const app = new AppBuilder(buildConfig);

app.build()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
