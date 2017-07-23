
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Heading, Screen, TextInput, Button, Text } from '@shoutem/ui';


@inject('store') @observer
class Login extends Component {
    state = {
        username: '',
        password: '',
        error: ''
    }

    changeUsername = (username) => {
        this.setState({
            username
        });
    }

    changePassword = (password) => {
        this.setState({
            password
        });
    }

    submit = () => {
        const { username, password } = this.state;

        if (!username || !password) {
            this.setState({
                error: 'Missing info'
            });
        }
    }

    render() {
        return (
            <Screen>
                <Heading styleName="h-center">Login to HackerNews</Heading>

                <TextInput placeholder="Username"
                           onChangeText={this.changeUsername}
                           onSubmitEditing={this.submit}
                           autoCapitalize="none"
                           autoCorrect={false}
                           blurOnSubmit />
                <TextInput placeholder="Password"
                           onChangeText={this.changePassword}
                           onSubmitEditing={this.submit}
                           secureTextEntry
                           autoCapitalize="none"
                           autoCorrect={false}
                           blurOnSubmit />
                <Button onPress={this.submit}>
                    <Text>LOGIN</Text>
                </Button>

                <Text styleName="h-center"
                      style={{marginTop: 10, color: 'red'}}>
                    {this.state.error}
                </Text>
            </Screen>
        );
    }
}

export default Login;
