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
import { validateYoutubeUrl } from '../../services/youtube';
import './style.scss';

const TOOLTIP_LABEL = 'Enter link to the YouTube profile, channel or a playlist.';

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
    const feedUrl = _.trim(this.state.feedUrl);
    if (!validateYoutubeUrl(feedUrl)) {
      this.setState({
        error: TOOLTIP_LABEL,
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
    this.handleContinueClick();
  }

  handleTextChangeError() {
    const { error } = this.state;

    if (!error) {
      return (
        <ControlLabel>
          {TOOLTIP_LABEL}
        </ControlLabel>
      );
    }
    return (<ControlLabel className="text-error feed-url-input__error">
      {error}
    </ControlLabel>);
  }

  render() {
    return (
      <div className="feed-url-input">
        <form onSubmit={this.handleSubmit}>
          <FormGroup validationState={this.getValidationState()}>
            <ControlLabel>YouTube source</ControlLabel>
            <FormControl
              type="text"
              className="form-control"
              value={this.state.feedUrl}
              onChange={this.handleTextChange}
            />
          </FormGroup>
        </form>
        {this.handleTextChangeError()}
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
