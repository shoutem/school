#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const getPlatformDependencies = require('./helpers/get-platform-dependencies');
const platformPath = path.resolve(path.join('platform', 'platform.json'));
const platformJson = fs.readJsonSync(platformPath);

platformJson.dependencies = getPlatformDependencies(process.argv[2]);
fs.writeJsonSync(platformPath, platformJson);
