const exec = require('child_process').execSync;

const dependenciesToLink = ['react-native-shopify'];

const command = 'node node_modules/react-native/local-cli/cli.js link';

dependenciesToLink.forEach((dependency) => {
  exec(`${command} ${dependency}`);
});
