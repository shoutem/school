import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import {
  Button,
  ButtonToolbar,
  FormGroup,
  ControlLabel,
  FormControl,
} from 'react-bootstrap';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { validateWordpressUrl } from '../../services/wordpress';
import './style.scss';

export default class FeedUrlInput extends Component {
  constructor(props) {
    super(props);

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleContinueClick = this.handleContinueClick.bind(this);
    this.getValidationState = this.getValidationState.bind(this);
    this.handleTextChangeError = this.handleTextChangeError.bind(this);

    this.state = {
      feedUrl: '',
      error: props.error,
    };
  }

  getValidationState() {
    return this.state.error ? 'error' : 'success';
  }

  handleContinueClick() {
    const feedUrl = _.trim(this.state.feedUrl, '/ ');
    if (!validateWordpressUrl(feedUrl)) {
      this.setState({
        error: 'Invalid url.',
      });
    } else {
      this.props.onContinueClick(feedUrl);
    }
  }

  handleTextChange(event) {
    this.setState({
      feedUrl: event.target.value,
      error: null,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.feedUrl) {
      this.handleContinueClick();
    }
  }

  handleTextChangeError() {
    if (!this.state.error) {
      return null;
    }
    return (
      <ControlLabel className="text-error feed-url-input__error">
        {this.state.error}
      </ControlLabel>
    );
  }

  render() {
    return (
      <div className="feed-url-input">
        <form onSubmit={this.handleSubmit}>
          <FormGroup validationState={this.getValidationState()}>
            <ControlLabel>
              Wordpress page URL
            </ControlLabel>
            <FormControl
              type="text"
              className="form-control"
              value={this.state.feedUrl}
              onChange={this.handleTextChange}
            />
          </FormGroup>
          {this.handleTextChangeError()}
        </form>
        <ControlLabel>
          WordPress versions 4.4 or newer. In case your site is using WordPress version 4.4 to 4.7, you will need to install a plugin
          in order to fetch posts. For WordPress version 4.7 and above it is going to work out of the box. 
          If you are using an older version of WordPress, you will need to update it.
        </ControlLabel>
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            disabled={!this.state.feedUrl}
            onClick={this.handleContinueClick}
          >
            <LoaderContainer isLoading={this.props.inProgress}>
              Continue
            </LoaderContainer>
          </Button>
        </ButtonToolbar>
      </div>
    );
  }
}

FeedUrlInput.propTypes = {
  onContinueClick: PropTypes.func,
  error: PropTypes.string,
  inProgress: PropTypes.bool,
};

FeedUrlInput.defaultProps = {
  inProgress: false,
};
