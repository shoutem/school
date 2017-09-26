import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  ScreenStack,
  navigateTo,
  jumpToKey,
  reset,
  navigateBack,
  setActiveNavigationStack,
  hasRouteWithKey,
} from '@shoutem/core/navigation';
import { connectStyle } from '@shoutem/theme';
import _ from 'lodash';
import {
  View,
  Screen,
} from '@shoutem/ui';
import {
  NavigationBar,
} from '@shoutem/ui/navigation';

import {
  executeShortcut,
  getActiveShortcut,
} from 'shoutem.application';

import { ext } from '../const';
import TabBarItem from '../components/TabBarItem';
import { shortcutChildrenRequired } from '../helpers';
import {
  TAB_BAR_NAVIGATION_STACK,
  getTabNavigationStateFromTabBarState,
  getTabNavigationStack,
} from '../redux';

const TABS_LIMIT = 5;

export class TabBar extends PureComponent {
  static propTypes = {
    // Server props
    shortcut: React.PropTypes.object.isRequired,
    startingScreen: React.PropTypes.string,
    showText: React.PropTypes.bool,
    showIcon: React.PropTypes.bool,

    // Props from local state (connect)

    navigationState: React.PropTypes.object,
    // navigationState.routes contains the specific tab shortcut object

    tabStates: React.PropTypes.object,
    tabStacks: React.PropTypes.object,
    executeShortcut: React.PropTypes.func,
    navigateTo: React.PropTypes.func,
    navigateBack: React.PropTypes.func,
    reset: React.PropTypes.func,
    jumpToKey: React.PropTypes.func,
    setActiveNavigationStack: React.PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);

    this.openShortcut = this.openShortcut.bind(this);
    // Debounce the reset tab to top to avoid weird issues (e.g., app freezes)
    // when the navigation state is being reset during transitions.
    this.resetTabNavigationStateToTop = _.debounce(this.resetTabNavigationStateToTop, 300, {
      maxWait: 100,
    });
  }

  componentWillMount() {
    const startingShortcut = this.getStartingShortcut();
    this.openShortcut(startingShortcut);
  }

  getStartingShortcut() {
    const { startingScreen, shortcut } = this.props;
    const childShortcuts = shortcut.children;
    return _.find(childShortcuts, ['id', startingScreen]) || _.first(childShortcuts);
  }

  getTabRouteForShortcut(shortcut) {
    return {
      context: {
        shortcutId: shortcut.id,
      },
      key: getTabNavigationStack(shortcut.id).name,
      screen: ext('Tab'),
      props: {
        shortcut,
      },
    };
  }

  resetTabNavigationStateToTop(tabId) {
    const tabNavigationState = getTabNavigationStateFromTabBarState(this.props, tabId);
    const tabNavigationStackName = getTabNavigationStack(tabId);
    const firstRoute = _.head(tabNavigationState.routes);
    this.props.reset(firstRoute, tabNavigationStackName);
  }

  openShortcut(shortcut) {
    // eslint-disable-next-line no-shadow
    const {
      activeShortcut,
      executeShortcut,
      navigationState,
      navigateTo,
      jumpToKey,
      setActiveNavigationStack,
    } = this.props;

    if (shortcut === activeShortcut) {
      // Tapping twice on the same tab resets tab screens stack.
      this.resetTabNavigationStateToTop(shortcut.id);
      return;
    }

    const navigationStack = getTabNavigationStack(shortcut.id);
    const stackName = navigationStack.name;

    if (hasRouteWithKey(navigationState, stackName)) {
      setActiveNavigationStack(navigationStack);
      jumpToKey(stackName, TAB_BAR_NAVIGATION_STACK);
    } else {
      // Navigate to a new tab only if the shortcut opens a screen
      if (shortcut.screen) {
        setActiveNavigationStack(navigationStack);
        navigateTo(this.getTabRouteForShortcut(shortcut), TAB_BAR_NAVIGATION_STACK);
      }

      executeShortcut(shortcut.id, undefined, navigationStack);
    }
  }

  renderTabBarItems() {
    const {
      activeShortcut,
      showText,
      showIcon,
      shortcut: { children }
    } = this.props;

    return _.take(children, TABS_LIMIT).map(shortcut => (
      <TabBarItem
        key={`tab-bar-item-${shortcut.id}`}
        showText={showText}
        showIcon={showIcon}
        shortcut={shortcut}
        onPress={this.openShortcut}
        selected={_.isEqual(activeShortcut, shortcut)}
      />
    ));
  }

  render() {
    const { style } = this.props;

    return (
      <Screen style={style.screen}>
        <NavigationBar hidden />
        <ScreenStack
          styleName="without-transitions"
          useNativeAnimations={false}
          gestureResponseDistance={0}
          direction="vertical"
          navigationState={this.props.navigationState}
          onNavigateBack={this.props.navigateBack}
        />
        <View styleName="horizontal">
          {this.renderTabBarItems()}
        </View>
      </Screen>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state[ext()].tabBar,
  activeShortcut: getActiveShortcut(state),
});

const mapDispatchToProps = {
  executeShortcut,
  navigateTo,
  jumpToKey,
  navigateBack,
  reset,
  setActiveNavigationStack,
};
export default shortcutChildrenRequired(
  connect(mapStateToProps, mapDispatchToProps)(connectStyle(ext('TabBar'))(TabBar))
);
