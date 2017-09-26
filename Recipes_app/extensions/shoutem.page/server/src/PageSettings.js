import React, {
  Component,
  PropTypes,
} from 'react';

import { connect } from 'react-redux';

import _ from 'lodash';

import {
  ControlLabel,
  Dropdown,
  MenuItem,
} from 'react-bootstrap';

import { getShortcut } from 'environment';
import { updateShortcutSettings } from './reducer';

const navigationLayoutTypes = {
  iconGrid: 'Icon grid',
  list: 'List',
};

export class PageSettings extends Component {
  constructor(props) {
    super(props);

    this.getShortcutSettings = this.getShortcutSettings.bind(this);
    this.handleLayoutOptionSelected = this.handleLayoutOptionSelected.bind(this);
  }

  getShortcutSettings() {
    const { shortcut } = this.props;

    if (!_.get(shortcut, 'settings.navigationLayoutType')) {
      return { navigationLayoutType: 'iconGrid' };
    }

    return shortcut.settings;
  }

  handleLayoutOptionSelected(event) {
    const { shortcut: { id, settings }, updateShortcutSettings } = this.props;

    updateShortcutSettings(id, { ...settings, navigationLayoutType: event });
  }

  render() {
    const { navigationLayoutType } = this.getShortcutSettings();

    return (
      <div className="page-settings">
        <h3>Settings</h3>
        <ControlLabel>Choose layout</ControlLabel>
        <Dropdown className="block" onSelect={this.handleLayoutOptionSelected}>
          <Dropdown.Toggle>
            {navigationLayoutTypes[navigationLayoutType]}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {_.keys(navigationLayoutTypes).map(key => (
              <MenuItem key={key} eventKey={key}>{navigationLayoutTypes[key]}</MenuItem>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  }
}

const { func, shape, string } = PropTypes;

PageSettings.propTypes = {
  shortcut: shape({
    navigationLayoutType: string,
  }),
  updateShortcutSettings: func,
};

const mapStateToProps = () => ({
  shortcut: getShortcut(),
});

function mapDispatchToProps(dispatch) {
  return {
    updateShortcutSettings: (id, settings) => dispatch(updateShortcutSettings(id, settings)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PageSettings);
