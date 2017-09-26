import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import { ControlLabel, Dropdown, MenuItem } from 'react-bootstrap';

export default class StartingScreen extends Component {
  constructor(props) {
    super(props);

    this.getStartingScreenDropdownTitle = this.getStartingScreenDropdownTitle.bind(this);
    this.onStartingScreenSelected = this.onStartingScreenSelected.bind(this);
  }

  onStartingScreenSelected(event) {
    const { onSettingsChanged } = this.props;
    const newSettings = {
      startingScreen: event,
    };
    onSettingsChanged(newSettings);
  }

  getStartingScreenDropdownTitle(shortcutId) {
    if (!shortcutId) {
      return 'First shortcut in the main navigation';
    }

    const { childShortcuts } = this.props;
    const shortcut = _.find(childShortcuts, { id: shortcutId });
    if (!shortcut) {
      return 'First shortcut in the main navigation';
    }

    const firstChildShortcutId = _.get(childShortcuts, [0, 'id']);
    if (shortcut.id === firstChildShortcutId) {
      return `First screen in the main navigation (${shortcut.title})`;
    }
    return shortcut.title;
  }

  render() {
    const { settings, childShortcuts } = this.props;
    const firstChildShortcutId = _.get(childShortcuts, [0, 'id']);
    const startingScreenId = _.get(settings, ['startingScreen'], firstChildShortcutId);
    const hasChildShortcuts = childShortcuts && childShortcuts.length > 0;

    return (
      <div>
        <ControlLabel>Starting screen</ControlLabel>
        {hasChildShortcuts && (
          <Dropdown onSelect={this.onStartingScreenSelected} className="block">
            <Dropdown.Toggle>
              {this.getStartingScreenDropdownTitle(startingScreenId)}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {childShortcuts.map(shortcut => (
                <MenuItem key={shortcut.id} eventKey={shortcut.id}>{shortcut.title}</MenuItem>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        )}
        {!hasChildShortcuts && (
          <Dropdown disabled className="block">
            <Dropdown.Toggle>
              Add some screens first
            </Dropdown.Toggle>
            <Dropdown.Menu />
          </Dropdown>
        )}
      </div>
    );
  }
}

StartingScreen.propTypes = {
  settings: PropTypes.object.isRequired,
  onSettingsChanged: PropTypes.func.isRequired,
  childShortcuts: PropTypes.array.isRequired,
};
