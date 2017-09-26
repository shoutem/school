/**
 * This is an entry point file for iOS.
 * It sets up the JavaScript environment by incuding all the
 * polyfills and global variables necessary to run the common
 * code. After the environment has been set up it runs the
 * common entry point file index.js.
 *
 * Currently no JavaScript environment adjustments are needed
 * for the iOS platform.
 */

require('react-native-browser-polyfill');
require('es6-symbol/implement');
// Run index.js containing the common application logic
require('./index.js');
