
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactNative from 'react-native';

import { View } from '@shoutem/ui';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Messages from '../containers/Messages';
import Input from '../containers/Input';
import { sendMessage } from '../actions';

const mapStateToProps = (state) => ({
    user: state.user
});

class ChatUI extends Component {
    _scrollToInput(reactRef) {
        this.refs.scroll.scrollToFocusedInput(ReactNative.findNodeHandle(reactRef));
    }

    sendMessage = (text) => {
        return sendMessage(text, this.props.user)
    }

    render() {
        return (
            <KeyboardAwareScrollView ref="scroll">
                <View>
                    <Messages />
                    <Input onFocus={this._scrollToInput.bind(this)}
                           submitAction={this.sendMessage}
                           placeholder="Say something cool ..." />
                </View>
            </KeyboardAwareScrollView>
        )
    }
}

export default connect(mapStateToProps)(ChatUI);
