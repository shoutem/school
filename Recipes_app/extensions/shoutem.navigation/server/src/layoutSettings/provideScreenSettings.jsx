import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { getShortcut } from 'environment';
import { data } from 'context';
import { updateShortcut } from '../reducer';

export function provideScreenSettings(WrappedComponent) {
  class LayoutSettings extends React.Component {
    constructor(props) {
      super(props);

      this.handleSettingsChange = this.handleSettingsChange.bind(this);
      this.handleIconChange = this.handleIconChange.bind(this);
      this.getSettings = this.getSettings.bind(this);
    }

    getSettings() {
      const { shortcut } = this.props;
      const { screenDescriptor } = data;

      const screens = _.get(shortcut, 'screens', []);
      const screenMapping = _.find(screens, screenDescriptor);
      return _.get(screenMapping, 'settings', {});
    }

    handleSettingsChange(newSettings) {
      const { shortcut } = this.props;
      const { canonicalName, canonicalType } = data.screenDescriptor;

      // update requests defining whole screen array where screen settings with
      // corresponding canonical type and name (screen descriptor) is modified
      // by merging existing settings with modified settings
      const screens = _.get(shortcut, 'screens', []);
      const newScreens = _.map(screens, screen => {
        if (screen.canonicalName === canonicalName && screen.canonicalType === canonicalType) {
          return {
            ...screen,
            settings: _.merge({}, screen.settings, newSettings),
          };
        }
        return screen;
      });

      this.props.updateShortcut({
        id: shortcut.id,
        attributes: {
          screens: newScreens,
        },
      });
    }

    handleIconChange(shortcutId, changedIcons, layoutType) {
      const { updateShortcut } = this.props;
      updateShortcut({
        id: shortcutId,
        attributes: {
          settings: {
            navigation: {
              [layoutType]: changedIcons,
            },
          },
        },
      });
    }

    render() {
      const settings = this.getSettings();
      const { shortcut, updateShortcut } = this.props;
      const childShortcuts = _.get(shortcut, 'children', []);

      return (
        <WrappedComponent
          shortcut={shortcut}
          settings={settings}
          childShortcuts={childShortcuts}
          onSettingsChanged={this.handleSettingsChange}
          onIconChanged={this.handleIconChange}
          updateShortcut={updateShortcut}
        />
      );
    }
  }

  LayoutSettings.propTypes = {
    shortcut: PropTypes.object.isRequired,
    updateShortcut: PropTypes.func.isRequired,
  };

  return LayoutSettings;
}

export default function (WrappedComponent) {
  function mapStateToProps() {
    return {
      shortcut: getShortcut(),
    };
  }
  function mapDispatchToProps(dispatch) {
    return {
      updateShortcut: (shortcut) => dispatch(updateShortcut(shortcut)),
    };
  }
  return connect(mapStateToProps, mapDispatchToProps)(provideScreenSettings(WrappedComponent));
}
