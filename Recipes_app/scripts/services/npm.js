'use strict';

const spawn = require('child-process-promise').spawn;
const _ = require('lodash');

const npm = {
  link(path, cwd) {
    return spawn('npm', ['link', path], {
      stdio: 'ignore',
      cwd,
      shell: true,
      env: _.merge(process.env, { FORCE_COLOR: true })
    });
  }
};

module.exports = npm;
