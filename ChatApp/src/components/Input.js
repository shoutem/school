
import React, { Component } from 'react';

import { TextInput } from '@shoutem/ui';


class Input extends Component {
    state = {
        text: null
    }

    onChangeText = text => this.setState({text: text});

    onSubmitEditing = () => {
        this.props.onSubmit(this.state.text);
        this.setState({
            text: null
        });
    }

    render() {
        return (
            <TextInput placeholder="Say something cool ..."
                       onChangeText={this.onChangeText}
                       onSubmitEditing={this.onSubmitEditing}
                       value={this.state.text} />
        )
    }
}

export default Input;
