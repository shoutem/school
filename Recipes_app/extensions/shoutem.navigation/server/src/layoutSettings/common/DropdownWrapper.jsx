import React, { PropTypes } from 'react';
import _ from 'lodash';
import { Dropdown, MenuItem } from 'react-bootstrap';

export default function DropdownWrapper({ valuesMap, defaultKey, field, disabled }) {
  const selectedValue = field.value || defaultKey;
  return (
    <Dropdown className="block" onSelect={field.onChange} disabled={disabled}>
      <Dropdown.Toggle>
        {valuesMap[selectedValue]}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {_.keys(valuesMap).map((key) => (
          <MenuItem key={key} eventKey={key}>{valuesMap[key]}</MenuItem>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

DropdownWrapper.propTypes = {
  /**
   * Object from which keys are mapped to displayed values
   */
  valuesMap: PropTypes.object.isRequired,
  /**
   * Default value to take from values map (property name)
   */
  defaultKey: PropTypes.string.isRequired,
  /**
   * Field connector for form
   */
  field: PropTypes.object.isRequired,
  /**
   * Indicates whether dropdown is disabled
   */
  disabled: PropTypes.bool,
};
