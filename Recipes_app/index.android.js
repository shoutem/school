/**
 * This is an entry point file for Android.
 * It sets up the JavaScript environment by incuding all the
 * polyfills and global variables necessary to run the common
 * code. After the environment has been set up it runs the
 * common entry point file index.js.
 *
 * TODO(Vladimir) - reevaluate the use of this file on each
 * React Native update.
 */


/**
 * Use browser polyfill so that es6-symbol polyfill can work as it
 * expects to be used in a browser environment.
 * TODO(Vladimir) - remove once the es6-symbol polyfill is removed
 */
require('react-native-browser-polyfill');
/**
 * Use es6 symbol polyfill as a workaround for react native issue:
 * https://github.com/facebook/react-native/issues/4676
 */
require('es6-symbol/implement');

// Run index.js containing the common application logic
require('./index.js');
