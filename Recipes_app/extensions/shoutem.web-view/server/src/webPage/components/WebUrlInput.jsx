import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import {
  Button,
  ButtonToolbar,
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock,
} from 'react-bootstrap';
import validator from 'validator';
import './style.scss';

const validateUrl = url => validator.isURL(url, { require_protocol: false });

export default class WebUrlInput extends Component {
  constructor(props) {
    super(props);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleContinue = this.handleContinue.bind(this);
    this.getValidationState = this.getValidationState.bind(this);

    this.state = {
      url: '',
      error: null,
    };
  }

  getValidationState() {
    return this.state.error ? 'error' : false;
  }

  handleTextChange(event) {
    this.setState({
      url: event.target.value,
      error: null,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.url) {
      this.handleContinue();
    }
  }

  handleContinue() {
    const url = _.trim(this.state.url);
    if (validateUrl(url)) {
      this.props.onContinueClick(url);
    } else {
      this.setState({ error: 'Invalid URL.' });
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <FormGroup validationState={this.getValidationState()}>
            <ControlLabel>Website URL</ControlLabel>
            <FormControl
              type="text"
              className="form-control"
              onChange={this.handleTextChange}
            />
            <HelpBlock className="text-error">
              {this.state.error}
            </HelpBlock>
          </FormGroup>
        </form>
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            disabled={!this.state.url}
            onClick={this.handleContinue}
          >
            Continue
          </Button>
        </ButtonToolbar>
      </div>
    );
  }

}

WebUrlInput.propTypes = {
  onContinueClick: PropTypes.func,
};
