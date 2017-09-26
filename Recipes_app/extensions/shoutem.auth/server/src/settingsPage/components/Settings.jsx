import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormGroup, Checkbox } from 'react-bootstrap';
import _ from 'lodash';
import {
  updateExtensionInstallationSettings,
  loadShortcuts,
  updateShortcutSettings,
} from './../reducer';
import { getExtensionInstallationSettings, mergeSettings } from './../../settings';
import { denormalizeCollection, denormalizeItem } from 'denormalizer';
import { ext } from 'context';
import { getExtensionInstallation } from 'environment';
import { SHORTCUTS } from 'types';

export class Settings extends Component {
  constructor(props) {
    super(props);
    this.getExtensionInstallationSettings = this.getExtensionInstallationSettings.bind(this);
    this.setExtensionInstallationSettings = this.setExtensionInstallationSettings.bind(this);
    this.findShortcut = this.findShortcut.bind(this);
    this.setShortcutSettings = this.setShortcutSettings.bind(this);
    this.getRenderShortcuts = this.getRenderShortcuts.bind(this);
    this.renderShortcut = this.renderShortcut.bind(this);
    this.handleMakeAllScreensPrivateChange = this.handleMakeAllScreensPrivateChange.bind(this);
    this.handleShortcutPrivateChange = this.handleShortcutPrivateChange.bind(this);
  }

  componentWillMount() {
    this.props.loadShortcuts();
  }

  getExtensionInstallationSettings() {
    return getExtensionInstallationSettings(this.props.extensionInstallation);
  }

  setExtensionInstallationSettings(settings) {
    const id = this.props.extensionInstallation.id;
    const currentSettings = this.getExtensionInstallationSettings();
    const mergedSettings = mergeSettings(currentSettings, settings);
    this.props.updateExtensionInstallationSettings(id, mergedSettings);
  }

  findShortcut(shortcuts, id) {
    if (shortcuts) {
      for (const shortcut of shortcuts) {
        if (shortcut.id === id) {
          return shortcut;
        }
        if (shortcut.children) {
          const result = this.findShortcut(shortcut.children, id);
          if (result) {
            return result;
          }
        }
      }
    }
    return null;
  }

  setShortcutSettings(id, settings) {
    const shortcut = this.findShortcut(this.props.shortcuts, id);
    if (!shortcut) {
      return;
    }
    const currentSettings = shortcut.settings;
    const mergedSettings = {...currentSettings, ...settings};
    this.props.updateShortcutSettings(id, mergedSettings);
  }

  getRenderShortcuts(shortcuts, level=0) {
    let renderShortcuts = [];
    for (const shortcut of shortcuts) {
      renderShortcuts.push({
        id: shortcut.id,
        title: shortcut.title,
        protected: _.get(shortcut, ['settings', 'shoutemAuth', 'protected'], false),
        level: level
      });
      if (shortcut.children) {
        const childRenderShortcuts =
          this.getRenderShortcuts(shortcut.children, level + 1);
        for (const crs of childRenderShortcuts) {
          renderShortcuts.push(crs);
        }
      }
    }
    return renderShortcuts;
  }

  renderShortcut(shortcut) {
    const indentationStyle = {
      paddingLeft: (shortcut.level * 32) + 'px'
    };
    return (
      <tr key={shortcut.id}>
        <td style={indentationStyle}>
          <Checkbox
            id={shortcut.id}
            checked={shortcut.protected}
            onChange={this.handleShortcutPrivateChange}
          >
            {shortcut.title}
          </Checkbox>
        </td>
      </tr>
    );
  }

  handleMakeAllScreensPrivateChange(event) {
    if (!event.target) {
      return;
    }
    this.setExtensionInstallationSettings({ allScreensProtected: event.target.checked });
  }

  handleShortcutPrivateChange(event) {
    if (!event.target) {
      return;
    }
    this.setShortcutSettings(event.target.id, {
      shoutemAuth: {
        protected: event.target.checked
      }
    });
  }

  render() {
    const settings = this.getExtensionInstallationSettings();
    const allScreensProtected = _.get(settings, 'allScreensProtected', false);
    const { shortcuts } = this.props;
    
    return (
      <div>
        <form>
          <FormGroup>
            <h3>General settings</h3>
            <Checkbox
              checked={allScreensProtected}
              onChange={this.handleMakeAllScreensPrivateChange}
            >
              Make all screens private
            </Checkbox>
            {!allScreensProtected && (
              <h3>Select screens that require sign in</h3>
            )}
            {!allScreensProtected && (
              <table className="table">
                <thead>
                  <tr>
                    <td>Navigation item</td>
                  </tr>
                </thead>
                <tbody>
                {this.getRenderShortcuts(shortcuts).map(s => (
                  this.renderShortcut(s)
                ))}
                </tbody>
              </table>
            )}
          </FormGroup>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    extensionInstallation: getExtensionInstallation(),
    shortcuts: denormalizeCollection(state[ext()].settingsPage.shortcuts, undefined, SHORTCUTS),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateExtensionInstallationSettings: (id, settings) => dispatch(updateExtensionInstallationSettings(id, settings)),
    loadShortcuts: () => dispatch(loadShortcuts()),
    updateShortcutSettings: (id, settings) => dispatch(updateShortcutSettings(id, settings))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
