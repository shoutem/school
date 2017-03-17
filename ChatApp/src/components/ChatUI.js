
import React, { Component } from 'react';

import { Screen, ListView, TextInput } from '@shoutem/ui';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Messages from './Messages';
import Input from './Input';

class ChatUI extends Component {
    state = {
        messages: []
    }

    onSubmit(text) {
        const { messages } = this.state;

        this.setState({
            messages: messages.concat({
                text: text
            })
        });
    }

    render() {
        return (
            <Screen>
                <Messages messages={this.state.messages} />
                <Input onSubmit={this.onSubmit.bind(this)} />
            </Screen>
        );
    }
}

export default ChatUI;
