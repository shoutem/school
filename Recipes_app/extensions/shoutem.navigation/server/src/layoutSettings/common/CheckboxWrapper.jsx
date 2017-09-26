import React, { PropTypes } from 'react';
import { Checkbox } from 'react-bootstrap';

export default function CheckboxWrapper(props) {
  const { value, children, ...otherProps } = props;
  const options = value ? { checked: 'checked' } : {};

  return (
    <Checkbox {...options} {...otherProps}>{children}</Checkbox>
  );
}

CheckboxWrapper.propTypes = {
  /**
   * Represents is checkbox checked or not (if value is true, checkbox will have checked attribute)
   */
  value: PropTypes.bool.isRequired,
  /**
   * Passed down to Checkbox as content (usually checkbox text)
   */
  children: PropTypes.node.isRequired,
};

