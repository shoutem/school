import React, { Component, PropTypes } from 'react';
import { FormGroup, ControlLabel, Checkbox } from 'react-bootstrap';
import { FontIcon } from '@shoutem/react-web-ui';
import './style.scss';

export default class WebEdit extends Component {
  constructor(props) {
    super(props);

    this.handleShowNavigationToolbarChange = this.handleShowNavigationToolbarChange.bind(this);
  }

  handleShowNavigationToolbarChange(event) {
    if (event.target) {
      this.props.onShowNavigationToolbarChange(event.target.checked);
    }
  }

  render() {
    const {
      url,
      showNavigationToolbar,
      hasNavigationToolbarToggle,
      onRemoveClick,
    } = this.props;

    return (
      <div>
        <form>
          <FormGroup>
            <ControlLabel>Website URL</ControlLabel>
            <div className="web-edit__url-container">
              <div className="web-edit__web-img" />
              <div className="text-ellipsis">
                <span className="web-edit__url">
                  {url}
                </span>
              </div>
              <FontIcon
                className="web-edit__remove"
                name="close"
                size="large"
                onClick={onRemoveClick}
              />
            </div>
            {hasNavigationToolbarToggle && (
              <div>
                <ControlLabel>Screen options</ControlLabel>
                <Checkbox
                  checked={showNavigationToolbar}
                  onChange={this.handleShowNavigationToolbarChange}
                >
                  Show navigation toolbar
                </Checkbox>
              </div>
            )}
          </FormGroup>
        </form>
      </div>
    );
  }
}

WebEdit.propTypes = {
  hasNavigationToolbarToggle: PropTypes.bool,
  url: PropTypes.string,
  showNavigationToolbar: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  onShowNavigationToolbarChange: PropTypes.func,
};
