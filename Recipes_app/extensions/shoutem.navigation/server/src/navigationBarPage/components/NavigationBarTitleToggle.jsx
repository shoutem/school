import React, { Component } from 'react';
import {
  FormGroup,
  ControlLabel,
  Dropdown,
  MenuItem,
} from 'react-bootstrap';

const SHOW_TITLE_OPTION = 1;
const HIDE_TITLE_OPTION = 0;
const SHOW_TITLE_LABEL = 'Show always';
const HIDE_TITLE_LABEL = 'Hide over background image';

const isTitleVisible = (selectedValue) =>
  (selectedValue === SHOW_TITLE_OPTION);

const resolveTitleMenuLabel = (showTitle) => {
  if (showTitle) {
    return SHOW_TITLE_LABEL;
  }
  return HIDE_TITLE_LABEL;
};

export default class NavigationBarTitleToggle extends Component {
  static propTypes = {
    showTitle: React.PropTypes.bool,
    onTitleToggle: React.PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.handleTitleToggle = this.handleTitleToggle.bind(this);
  }

  handleTitleToggle(selectedValue) {
    const { onTitleToggle } = this.props;
    onTitleToggle(isTitleVisible(selectedValue));
  }

  render() {
    const {
      showTitle,
      onTitleToggle,
    } = this.props;

    return (
      <FormGroup className="navigation-bar-page-title">
        <ControlLabel>Navigation title</ControlLabel>
        <Dropdown
          onSelect={selectedValue => onTitleToggle(isTitleVisible(selectedValue))}
          className="block"
        >
          <Dropdown.Toggle>
            {resolveTitleMenuLabel(showTitle)}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <MenuItem key={SHOW_TITLE_OPTION} eventKey={SHOW_TITLE_OPTION}>
              {SHOW_TITLE_LABEL}
            </MenuItem>
            <MenuItem key={HIDE_TITLE_OPTION} eventKey={HIDE_TITLE_OPTION}>
              {HIDE_TITLE_LABEL}
            </MenuItem>
          </Dropdown.Menu>
        </Dropdown>
      </FormGroup>
    );
  }
}
