/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry
} from 'react-native';

import App from './src';

export default class HackerNewsApp extends Component {
  render() {
    return (
      <App />
    );
  }
}

AppRegistry.registerComponent('HackerNewsApp', () => HackerNewsApp);
