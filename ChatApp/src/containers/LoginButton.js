
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Button, Text } from '@shoutem/ui';
import { login } from '../actions';

class LoginButton extends Component {
    onLogin = () => {
        this.props.dispatch(login());
    }

    render() {
        return (
            <Button styleName="light" onPress={this.onLogin}>
                <Text>Start Chatting</Text>
            </Button>
        )
    }
}

export default connect()(LoginButton);
