import React, { Component } from 'react';
import {
  FormGroup,
  ControlLabel,
  Dropdown,
  MenuItem,
} from 'react-bootstrap';

const BACKGROUND_IMAGE_ENABLED_FIRST_SCREEN_OPTION = 1;
const BACKGROUND_IMAGE_ALL_SCREENS_OPTION = 0;
const ALL_SCREENS_LABEL = 'Show on all screens';
const FIRST_SCREEN_LABEL = 'Show only on the first screen of the app';

const isBackgroundImageFirstScreenOnly = (selectedValue) =>
  (selectedValue === BACKGROUND_IMAGE_ENABLED_FIRST_SCREEN_OPTION);

const resolveBackgroundMenuLabel = (imageEnabledFirstScreen) => {
  if (imageEnabledFirstScreen) {
    return FIRST_SCREEN_LABEL;
  }
  return ALL_SCREENS_LABEL;
};

export default class NavigationBarFirstScreenImageToggle extends Component {
  constructor(props) {
    super(props);

    this.handleBackgroundImageToggle = this.handleBackgroundImageToggle.bind(this);
  }

  /**
   * Handle background image first screen option toggle
   * @param {void} selectedValue
   */
  handleBackgroundImageToggle(selectedValue) {
    const {
      onBackgroundImageToggle,
    } = this.props;

    onBackgroundImageToggle(isBackgroundImageFirstScreenOnly(selectedValue));
  }

  render() {
    const {
      backgroundImageEnabledFirstScreen,
    } = this.props;

    return (
      <FormGroup className="navigation-bar-page-first-screen-toggle">
        <ControlLabel>Background settings</ControlLabel>
        <Dropdown
          className="block"
          onSelect={this.handleBackgroundImageToggle}
        >
          <Dropdown.Toggle>
            {resolveBackgroundMenuLabel(backgroundImageEnabledFirstScreen)}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <MenuItem
              key={BACKGROUND_IMAGE_ALL_SCREENS_OPTION}
              eventKey={BACKGROUND_IMAGE_ALL_SCREENS_OPTION}
            >
              {ALL_SCREENS_LABEL}
            </MenuItem>
            <MenuItem
              key={BACKGROUND_IMAGE_ENABLED_FIRST_SCREEN_OPTION}
              eventKey={BACKGROUND_IMAGE_ENABLED_FIRST_SCREEN_OPTION}
            >
              {FIRST_SCREEN_LABEL}
            </MenuItem>
          </Dropdown.Menu>
        </Dropdown>
      </FormGroup>
    );
  }
}

NavigationBarFirstScreenImageToggle.propTypes = {
  backgroundImageEnabledFirstScreen: React.PropTypes.bool,
  onBackgroundImageToggle: React.PropTypes.func,
};
