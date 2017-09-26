'use strict';

const fs = require('fs-extra');
const path = require('path');
const spawn = require('child-process-promise').spawn;
const _ = require('lodash');
const glob = require('glob');
const colors = require('colors');
const promisify = require('pify');
const linkLocal = promisify(require('linklocal'));

const packageJsonTemplate = fs.readJsonSync(path.resolve('package.template.json'));

const npm = require('../services/npm');

function addDependencyToPackageJson(packageJson, name, version) {
  // eslint-disable-next-line no-param-reassign
  packageJson.dependencies[name] = version;
}

function npmInstall() {
  console.log('Installing dependencies:'.bold);
  return spawn('npm', ['install'], { stderr: 'inherit', stdio: 'inherit' });
}

function installNpmExtension(extension) {
  // This actually could be any valid npm install argument (version range, GitHub repo,
  // URL to .tgz file or event local path) but for now is always URL to .tgz stored on our server
  const extensionPackageURL = _.get(extension, 'attributes.location.app.package');
  const packageName = extension.id;
  addDependencyToPackageJson(packageJsonTemplate, packageName, extensionPackageURL);
}

function writePackageJson(content) {
  return new Promise((resolve, reject) => {
    fs.writeFile('package.json', JSON.stringify(content, null, 2), (error) => {
      if (error) {
        reject(error);
      }
      resolve();
    });
  });
}


/**
 * ExtensionInstaller links all local extensions and installs all other extensions from app
 * configuration. It also builds extension.js file which app uses as depedencies dictionary.
 * @param  Array localExtensions The list of extensions in your local extensions folder
 * @param  Array extensions The list of extensions installed in app
 * @param  String extensionsJsPath path to extension.js file
 */
class ExtensionsInstaller {
  constructor(localExtensions = [], extensions = [], extensionsJsPath = '') {
    this.localExtensions = localExtensions;
    this.extensionsJsPath = extensionsJsPath;
    this.extensionsToInstall = extensions;

  }

  installExtensions() {
    this.extensionsToInstall.forEach((extension) =>
      installNpmExtension(extension)
    );

    this.localExtensions.forEach((extension) =>
      addDependencyToPackageJson(packageJsonTemplate, extension.id, `file:${extension.path}`)
    );

    const installedExtensions = [
      ...this.localExtensions,
      ...this.extensionsToInstall
    ];
    return writePackageJson(packageJsonTemplate)
      .then(() => linkLocal(process.cwd()))
      .then(() => npmInstall())
      .then(() =>
        Promise.resolve(installedExtensions)
      );
  }

  createExtensionsJs(installedExtensions) {
    console.log('Creating extensions.js');
    if (_.isEmpty(installedExtensions)) {
      return Promise.reject('[ERROR]: You are trying to build an app without any extensions'.bold.red);
    }

    const extensionsMapping = [];

    _.forEach(_.uniqBy(installedExtensions, 'id'), (extension) => {
      if (extension) {
        extensionsMapping.push(`'${extension.id}': require('${extension.id}'),\n  `);
      }
    });

    const extensionsString = extensionsMapping.join('');
    const data = `export default {\n  ${extensionsString}};\n`;

    console.time('Create extensions.js'.bold.green);
    return new Promise((resolve, reject) => {
      fs.writeFile(this.extensionsJsPath, data, (error) => {
        if (error) {
          reject(error);
        }

        console.timeEnd('Create extensions.js'.bold.green);
        resolve();
      });
    });
  }

  installNativeDependencies(installedExtensions) {
    // Check if process is running on Mac OS run 'pod install' to configure iOS native dependencies
    if (process.platform === 'darwin') {
      console.log('Starting pods install...');
      const podFileTemplate = fs.readFileSync('ios/Podfile.template', 'utf8', (error) =>
        Promise.reject(error)
      );
      const podspecPaths = _.reduce(installedExtensions, (paths, extension) =>
          paths.concat(glob.sync(`node_modules/${extension.id}/*.podspec`))
        , []);
      const pods = _.map(podspecPaths, (podspecPath) =>
        `pod '${path.basename(podspecPath, '.podspec')}', :path => '../${podspecPath}'`
      );
      const extensionsPlaceholderRegExp = /## <Extension dependencies>/g;
      const podFileContent = podFileTemplate.replace(extensionsPlaceholderRegExp, pods.join('\n'));
      fs.writeFileSync('ios/Podfile', podFileContent);

      return spawn('pod', ['install'], {
        stdio: 'inherit',
        cwd: 'ios',
        env: _.merge(process.env, { FORCE_COLOR: true })
      });
    }

    return Promise.resolve();
  }
}

module.exports = ExtensionsInstaller;
