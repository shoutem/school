import React, { PropTypes } from 'react';
import { ControlLabel } from 'react-bootstrap';
import { Switch } from '@shoutem/react-web-ui';
import './style.scss';

export default function RulesToggleSwitch({ value, onToggle }) {
  return (
    <div className="rules-toggle-switch">
      <ControlLabel>
        Enable custom rules for this place
      </ControlLabel>
      <Switch
        className="pull-right"
        onChange={onToggle}
        value={value}
      />
    </div>
  );
}

RulesToggleSwitch.propTypes = {
  value: PropTypes.bool,
  onToggle: PropTypes.func,
};
