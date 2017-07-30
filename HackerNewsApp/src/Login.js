
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Heading, Screen, TextInput, Button, Text, Spinner } from '@shoutem/ui';


@inject('store') @observer
class Login extends Component {
    state = {
        username: '',
        password: '',
        error: '',
        loggingIn: false
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
        const { username, password, loggingIn } = this.state,
              { store } = this.props;

        if (loggingIn) return;

        if (!username || !password) {
            this.setState({
                error: 'Missing info'
            });
        }else{
            this.setState({ loggingIn: true });
            store.login(username, password).then(success => {
                if (success) {
                    store.navigateBack();
                }else{
                    this.setState({
                        loggingIn: false,
                        error: "Bad login"
                    });
                }
            });
        }
    }

    render() {
        return (
            <Screen styleName="fill-parent v-center">
                <Heading styleName="h-center" style={{paddingBottom: 10}}>
                    Login to HackerNews
                </Heading>

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
                    {this.state.loggingIn ? <Spinner /> : <Text>LOGIN</Text>}
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
