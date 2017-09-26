import React, { Component } from 'react';
import {
  FormGroup,
  ControlLabel,
  Dropdown,
  MenuItem,
} from 'react-bootstrap';

const ORIGINAL_SIZE_OPTION = 0;
const FIT_CONTAINER_OPTION = 1;
const FIT_CONTAINER_LABEL = 'Fill background';
const ORIGINAL_SIZE_LABEL = 'Original size';

const shouldBackgroundImageFitContainer = selectedValue => (
  selectedValue === FIT_CONTAINER_OPTION
);

const resolveBackgroundSizeMenuLabel = (fitContainer) => {
  if (fitContainer) {
    return FIT_CONTAINER_LABEL;
  }
  return ORIGINAL_SIZE_LABEL;
};

export default class NavigationBarBackgroundSize extends Component {
  constructor(props) {
    super(props);

    this.handleBackgroundSizeToggle = this.handleBackgroundSizeToggle.bind(this);
  }

  /**
   * Handle background size toggle
   * @param {void} selectedValue
   */
  handleBackgroundSizeToggle(selectedValue = null) {
    const { onBackgroundSizeToggle } = this.props;
    onBackgroundSizeToggle(shouldBackgroundImageFitContainer(selectedValue));
  }

  render() {
    const {
      fitContainer,
    } = this.props;

    return (
      <FormGroup className="navigation-bar-page-background-size">
        <ControlLabel>Background size</ControlLabel>
        <Dropdown
          className="block"
          onSelect={this.handleBackgroundSizeToggle}
        >
          <Dropdown.Toggle>
            {resolveBackgroundSizeMenuLabel(fitContainer)}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <MenuItem key={ORIGINAL_SIZE_OPTION} eventKey={ORIGINAL_SIZE_OPTION}>
              {ORIGINAL_SIZE_LABEL}
            </MenuItem>
            <MenuItem key={FIT_CONTAINER_OPTION} eventKey={FIT_CONTAINER_OPTION}>
              {FIT_CONTAINER_LABEL}
            </MenuItem>
          </Dropdown.Menu>
        </Dropdown>
      </FormGroup>
    );
  }
}

NavigationBarBackgroundSize.propTypes = {
  fitContainer: React.PropTypes.bool,
  onBackgroundSizeToggle: React.PropTypes.func,
};
