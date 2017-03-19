/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry
} from 'react-native';

import { Examples } from '@shoutem/ui';

import App from './src/App.js';

export default class ChatApp extends Component {
    render() {
        return (
            <App />
        );
    }
}

AppRegistry.registerComponent('ChatApp', () => ChatApp);
