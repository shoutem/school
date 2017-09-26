'use_strict';

const fs = require('fs');
const xcode = require('xcode');

const extensionPath = '../node_modules/shoutem.push-notifications';
const folderPath = `${extensionPath}/ios`;

const xcodeprojPath = 'ios/ShoutemApp.xcodeproj/project.pbxproj';
const xcodeProject = xcode.project(xcodeprojPath).parseSync();

const groupKey = xcodeProject.findPBXGroupKey({ name: 'ShoutemApp' });

xcodeProject.addHeaderFile(`${folderPath}/Permissions.h`, {}, groupKey);
xcodeProject.addSourceFile(`${folderPath}/Permissions.m`,
{ target: xcodeProject.getFirstTarget().uuid }, groupKey);

fs.writeFileSync(xcodeprojPath, xcodeProject.writeSync());
console.log(`iOS: Added ${folderPath} files to ${xcodeprojPath} resources`);
