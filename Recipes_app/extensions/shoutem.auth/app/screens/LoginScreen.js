import React, {
  Component,
} from 'react';

import {
  Alert,
  InteractionManager,
} from 'react-native';

import {
  AccessToken,
  LoginManager,
} from 'react-native-fbsdk';

import { connect } from 'react-redux';

import _ from 'lodash';

import {
  Icon,
  TextInput,
  Screen,
  Divider,
  Button,
  Text,
  Caption,
  View,
  Spinner,
} from '@shoutem/ui';

import { connectStyle } from '@shoutem/theme';

import {
  navigateTo,
  isScreenActive,
} from '@shoutem/core/navigation';

import { isBusy } from '@shoutem/redux-io';

import {
  getAppId,
  getExtensionSettings,
} from 'shoutem.application';

import { NavigationBar } from '@shoutem/ui/navigation';

import { ext } from '../const';

import {
  login,
  loginWithFacebook,
  isAuthenticated,
  userLoggedIn,
} from '../redux';

import {
  errorMessages,
  getErrorMessage,
} from '../errorMessages';

import { saveSession } from '../session';

import { loginRequired } from '../loginRequired';

const renderAuthenticatingMessage = () => <Spinner styleName="xl-gutter-top" />;

const handleLoginError = ({ payload }) => {
  const { response } = payload;
  Alert.alert('Login failure', getErrorMessage(response && response.code));
};

const getFacebookAccessToken = () => AccessToken.refreshCurrentAccessTokenAsync().then(() =>
  AccessToken.getCurrentAccessToken());

const { bool, func, shape, string } = React.PropTypes;

export class LoginScreen extends Component {
  static propTypes = {
    navigateTo: func,
    login: func,
    loginWithFacebook: func,

    isAuthenticated: bool,
    isAuthenticating: bool,
    onLoginSuccess: func,
    settings: shape({
      providers: shape({
        email: shape({
          enabled: bool,
        }),
        facebook: shape({
          appId: string,
          appName: string,
          enabled: bool,
        }),
      }),
      signupEnabled: bool,
    }),
    // Dispatched with user data returned from server when user has logged in
    userLoggedIn: func,
  };

  constructor(props, contex) {
    super(props, contex);

    this.finishLogin = this.finishLogin.bind(this);
    this.loginWithFacebook = this.loginWithFacebook.bind(this);
    this.loginWithFacebookAccessToken = this.loginWithFacebookAccessToken.bind(this);
    this.openFacebookLogin = this.openFacebookLogin.bind(this);
    this.openRegisterScreen = this.openRegisterScreen.bind(this);
    this.performLogin = this.performLogin.bind(this);

    this.renderRegisterButton = this.renderRegisterButton.bind(this);
    this.renderLoginComponent = this.renderLoginComponent.bind(this);

    this.state = {
      username: null,
      password: null,
    };
  }

  componentWillReceiveProps(newProps) {
    const { isScreenActive, isAuthenticated, onLoginSuccess } = newProps;
    // We want to replace the login screen if the user is authenticated
    // but only if it's the currently active screen as we don't want to
    //  replace screens in the background
    if (isScreenActive && isAuthenticated) {
      // We are running the callback after interactions because of the bug
      // in navigation which prevents us from navigating to other screens
      // while in the middle of a transition
      InteractionManager.runAfterInteractions(onLoginSuccess);
    }
  }

  openRegisterScreen() {
    const { navigateTo } = this.props;
    const route = {
      screen: ext('RegisterScreen'),
    };
    navigateTo(route);
  }

  loginWithFacebook() {
    getFacebookAccessToken()
      .then((data) => {
        if (data && data.accessToken) {
          this.loginWithFacebookAccessToken(data.accessToken);
        } else {
          throw new Error('Access token is not valid');
        }
      })
      .catch(this.openFacebookLogin);
  }

  openFacebookLogin() {
    LoginManager.logInWithReadPermissions(['public_profile', 'email'])
      .then((result) => {
        if (result.isCancelled) {
          throw new Error('Login was cancelled');
        }
        return AccessToken.getCurrentAccessToken();
      }).then((data) => {
      if (!(data && data.accessToken)) {
        throw new Error();
      }
      this.loginWithFacebookAccessToken(data.accessToken);
    }).catch((error) => {
      Alert.alert('Login failure', error.message || errorMessages.UNEXPECTED_ERROR);
    });
  }

  loginWithFacebookAccessToken(accessToken) {
    const { loginWithFacebook } = this.props;

    loginWithFacebook(accessToken)
      .then(response => this.finishLogin(response, accessToken))
      .catch(handleLoginError);
  }

  finishLogin({ payload }, accessToken) {
    const { onLoginSuccess, userLoggedIn } = this.props;

    saveSession(JSON.stringify(payload));
    userLoggedIn({ ...payload.user, facebookAccessToken: accessToken });

    if (_.isFunction(onLoginSuccess)) {
      onLoginSuccess(payload.user);
    }
  }

  performLogin() {
    const { login } = this.props;
    const { username, password } = this.state;

    if (_.isEmpty(username) || _.isEmpty(password)) {
      Alert.alert('Error', errorMessages.EMPTY_FIELDS);
      return;
    }

    login(username, password)
      .then(this.finishLogin)
      .catch(handleLoginError);
  }

  renderRegisterButton() {
    const { settings } = this.props;
    let buttons = null;
    if (settings.signupEnabled) {
      buttons = (
        <View>
          <Caption styleName="h-center lg-gutter-vertical">
            Not a member?
          </Caption>
          <Button styleName="full-width inflexible" onPress={this.openRegisterScreen}>
            <Text>REGISTER</Text>
          </Button>
        </View>
      );
    }
    return buttons;
  }

  renderLoginComponent() {
    const { settings } = this.props;
    let components = null;
    if (settings.providers.email.enabled) {
      components = (
        <View>
          <Divider />
          <Divider styleName="line" />
          <TextInput
            placeholder="Username or Email"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            keyboardAppearance="dark"
            onChangeText={username => this.setState({ username })}
            returnKeyType="done"
          />
          <Divider styleName="line" />
          <TextInput
            placeholder="Password"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardAppearance="dark"
            secureTextEntry
            onChangeText={password => this.setState({ password })}
            returnKeyType="done"
          />
          <Divider styleName="line" />
          <Divider />
          <Button
            styleName="full-width inflexible"
            onPress={this.performLogin}
          >
            <Text>LOG IN</Text>
          </Button>
        </View>
      );
    }
    return components;
  }

  renderFacebookLoginButton() {
    return (
      <View>
        <Caption styleName="h-center lg-gutter-vertical">
          or sign in/sign up with your other account
        </Caption>
        <Button
          onPress={this.loginWithFacebook}
          styleName="full-width inflexible"
        >
          <Icon name="facebook" />
          <Text>FACEBOOK</Text>
        </Button>
      </View>
    );
  }

  render() {
    const { isAuthenticating, settings: { providers: { facebook } } } = this.props;

    let screenContent = null;
    if (isAuthenticating || this.props.isAuthenticated) {
      // We want to display the authenticating state if the
      // auth request is in progress, or if we are already
      // authenticated. The latter case can happen if the
      // login screen is left in the navigation stack history,
      // but the user authenticated successfully in another
      // part of the app.
      screenContent = renderAuthenticatingMessage();
    } else {
      screenContent = (
        <View>
          <NavigationBar title="LOG IN" />
          {this.renderLoginComponent()}
          {facebook.enabled ? this.renderFacebookLoginButton() : null}
          {this.renderRegisterButton()}
          <Divider />
        </View>
      );
    }

    return (
      <Screen>
        {screenContent}
      </Screen>
    );
  }
}

const mapDispatchToProps = {
  navigateTo,
  login,
  loginWithFacebook,
  userLoggedIn,
};

function mapStateToProps(state, ownProps) {
  return {
    user: state[ext()].user,
    isAuthenticated: isAuthenticated(state),
    isAuthenticating: isBusy(state[ext()]),
    appId: getAppId(),
    settings: getExtensionSettings(state, ext()),
    isScreenActive: isScreenActive(state, ownProps.screenId),
  };
}

export default loginRequired(connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('LoginScreen'))(LoginScreen)), false);
