
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sendMessage } from '../actions';

import { TextInput } from '@shoutem/ui';


class Input extends Component {
    state = {
        text: null
    }

    onChangeText = text => this.setState({text: text});

    onSubmitEditing = () => {
        this.props.dispatch(sendMessage(this.state.text));
        this.setState({
            text: null
        });
    }

    onFocus = (event) => {
        this.props.onFocus(this.refs.input);
    }

    render() {
        return (
            <TextInput placeholder="Say something cool ..."
                       onChangeText={this.onChangeText}
                       onSubmitEditing={this.onSubmitEditing}
                       value={this.state.text}
                       onFocus={this.onFocus}
                       ref="input"/>
        )
    }
}

export default connect()(Input);
