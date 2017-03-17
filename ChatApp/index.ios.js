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

import ChatUI from './src/components/ChatUI';

export default class ChatApp extends Component {
    render() {
        return (
            <ChatUI />
        );
    }
}

AppRegistry.registerComponent('ChatApp', () => ChatApp);
