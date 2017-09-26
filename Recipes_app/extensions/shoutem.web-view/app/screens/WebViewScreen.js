import React from 'react';

import {
  WebView,
  InteractionManager,
} from 'react-native';

import { View, Screen } from '@shoutem/ui';
import { NavigationBar } from '@shoutem/ui/navigation';

import {
  EmptyStateView,
} from '@shoutem/ui-addons';

import { NO_URL_MESSAGE } from '../const';
import NavigationToolbar from '../components/NavigationToolbar';

const { bool, shape, string } = React.PropTypes;

export default class WebViewScreen extends React.Component {
  static propTypes = {
    shortcut: shape({
      settings: shape({
        showNavigationToolbar: bool,
        url: string,
        title: string,
      }),
    }),
  };

  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
    this.goForward = this.goForward.bind(this);
    this.reload = this.reload.bind(this);
    this.setWebViewRef = this.setWebViewRef.bind(this);
    this.renderNavigationBar = this.renderNavigationBar.bind(this);
    this.onNavigationStateChange = this.onNavigationStateChange.bind(this);

    this.state = {
      webNavigationState: {},
      isAnimationFinished: false,
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ isAnimationFinished: true });
    });
  }

  onNavigationStateChange(webState) {
    this.setState({
      webNavigationState: webState,
    });
  }

  getSettings() {
    const { shortcut } = this.props;

    return shortcut ? shortcut.settings || {} : this.props;
  }

  setWebViewRef(ref) {
    this.webViewRef = ref;
  }

  goBack() {
    this.webViewRef.goBack();
  }

  goForward() {
    this.webViewRef.goForward();
  }

  reload() {
    this.webViewRef.reload();
  }

  isNavigationEnabled() {
    const { showNavigationToolbar } = this.getSettings();
    const { webNavigationState } = this.state;

    const webNavigation = webNavigationState.canGoBack || webNavigationState.canGoForward;
    return showNavigationToolbar && webNavigation;
  }

  renderNavigationBar() {
    const { url, title } = this.getSettings();

    return (
      <NavigationBar
        title={title}
        share={{
          title,
          link: url,
        }}
      />
    );
  }

  renderWebView() {
    const { url } = this.getSettings();

    if (this.state.isAnimationFinished) {
      return (
        <WebView
          ref={this.setWebViewRef}
          source={{ uri: url }}
          scalesPageToFit
          onNavigationStateChange={this.onNavigationStateChange}
        />
      );
    }

    return (<View />);
  }

  renderWebNavigation() {
    if (!this.isNavigationEnabled()) {
      return null;
    }

    return (
      <NavigationToolbar
        webNavigationState={this.state.webNavigationState}
        goBack={this.goBack}
        goForward={this.goForward}
        reload={this.reload}
      />
    );
  }

  renderBrowser() {
    const webView = this.renderWebView();
    const webNavigationControls = this.renderWebNavigation();

    return (
      <View styleName="flexible">
        {webView}
        {webNavigationControls}
      </View>
    );
  }

  renderPlaceholderView() {
    return (
      <EmptyStateView message={NO_URL_MESSAGE} />
    );
  }

  render() {
    const { url } = this.getSettings();

    if (!url) {
      return this.renderPlaceholderView();
    }

    return (
      <Screen>
        {this.renderNavigationBar()}
        {this.renderBrowser()}
      </Screen>
    );
  }
}
