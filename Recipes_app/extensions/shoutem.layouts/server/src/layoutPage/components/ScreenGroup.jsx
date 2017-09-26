import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import Screen from './Screen';
import { SettingsPageRenderer, ExtensionContextProvider } from '@shoutem/web-core';

const DEFAULT_GROUP_TITLE = 'Choose layout';

export default class ScreenGroup extends Component {
  constructor(props) {
    super(props);
    this.handleLayoutSettingsPageError = this.handleLayoutSettingsPageError.bind(this);
  }

  handleLayoutSettingsPageError() {
    // do nothing, layout settings page is optional
    return null;
  }

  render() {
    const {
      originalScreen,
      activeScreenDescriptor,
      onScreenSelected,
      shortcutId,
    } = this.props;
    const { alternativeScreens } = originalScreen;

    const title = _.get(originalScreen, 'groupTitle', DEFAULT_GROUP_TITLE);
    const activeScreenCanonicalName = _.get(activeScreenDescriptor, 'canonicalName');

    const alternativeScreen = _.find(alternativeScreens, [
      'canonicalName',
      activeScreenCanonicalName,
    ]);
    const activeScreen = alternativeScreen || originalScreen;

    const scope = {
      shortcutId,
      screenDescriptor: activeScreenDescriptor,
    };

    return (
      <div className="screen_group">
        <span className="screen_group__title">
          {title}
        </span>
        <div className="screen_group__screen-list">
          <Screen
            screen={originalScreen}
            isActive={originalScreen === activeScreen}
            onClick={onScreenSelected}
          />
          {alternativeScreens.map(screen => (
            <Screen
              key={screen.id}
              screen={screen}
              isActive={screen === activeScreen}
              onClick={onScreenSelected}
            />
          ))}
        </div>
        <div className="screen_group__settings">
          {activeScreen && activeScreen.settingsPage && (
            <ExtensionContextProvider
              key={activeScreen.settingsPage.page}
              context={{ screenDescriptor: activeScreenDescriptor }}
            >
              <SettingsPageRenderer
                key={activeScreen.settingsPage.page}
                settingsPageId={activeScreen.settingsPage.page}
                scope={scope}
                onError={this.handleLayoutSettingsPageError}
              />
            </ExtensionContextProvider>
          )}
        </div>
        <div className="screen_group__clear" />
      </div>
    );
  }
}

ScreenGroup.propTypes = {
  originalScreen: PropTypes.object,
  activeScreenDescriptor: PropTypes.object,
  shortcutId: PropTypes.string,
  onScreenSelected: PropTypes.func,
};
