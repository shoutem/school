
import React, { Component } from 'react';

import ReactNative from 'react-native';

import { View } from '@shoutem/ui';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as firebase from 'firebase';

import Messages from './Messages';
import Input from './Input';

class ChatUI extends Component {
    state = {
        messages: []
    }

    onComponentWillMount() {
        // Initialize Firebase
        // This should almost def be in a secret config
        var config = {
            apiKey: "AIzaSyDLFqbBXZJKo-GTtqWCWtDgmENuy4uaHpQ",
            authDomain: "chatapp-6c33c.firebaseapp.com",
            databaseURL: "https://chatapp-6c33c.firebaseio.com",
            storageBucket: "chatapp-6c33c.appspot.com",
            messagingSenderId: "566006872694"
        };
        firebase.initializeApp(config);
    }

    onSubmit(text) {
        const { messages } = this.state;

        this.setState({
            messages: messages.concat({
                text: text
            })
        });
    }

    _scrollToInput(reactRef) {
        this.refs.scroll.scrollToFocusedInput(ReactNative.findNodeHandle(reactRef));
    }

    render() {
        return (
            <KeyboardAwareScrollView ref="scroll">
                <View>
                    <Messages messages={this.state.messages} />
                    <Input onSubmit={this.onSubmit.bind(this)}
                           onFocus={this._scrollToInput.bind(this)} />
                </View>
            </KeyboardAwareScrollView>
        )
    }
}

export default ChatUI;
