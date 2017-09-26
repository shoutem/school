import React, { Component, PropTypes } from 'react';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { updateShortcutSettings } from '@shoutem/redux-api-sdk';
import { connect } from 'react-redux';
import './style.scss';
import _ from 'lodash';

class IcalPage extends Component {
  static propTypes = {
    shortcut: PropTypes.object,
    updateShortcutSettings: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      error: null,
      icalUrl: _.get(props.shortcut, 'settings.icalUrl'),
      // flag indicating if value in input field is changed
      hasChanges: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { shortcut: nextShortcut } = nextProps;
    const { icalUrl } = this.state;

    if (_.isEmpty(icalUrl)) {
      this.setState({
        icalUrl: _.get(nextShortcut, 'settings.icalUrl'),
      });
    }
  }

  handleTextChange(event) {
    this.setState({
      icalUrl: event.target.value,
      hasChanges: true,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.handleSave();
  }

  handleSave() {
    const { shortcut } = this.props;
    const { icalUrl } = this.state;

    this.setState({ error: '', inProgress: true });
    this.props.updateShortcutSettings(shortcut, { icalUrl })
      .then(() => (
        this.setState({ hasChanges: false, inProgress: false })
      )).catch((err) => {
        this.setState({ error: err, inProgress: false });
      });
  }

  render() {
    const { error, hasChanges, inProgress, icalUrl } = this.state;

    return (
      <div className="ical-page">
        <form onSubmit={this.handleSubmit}>
          <FormGroup>
            <h3>Enter your iCal url</h3>
            <ControlLabel>Url</ControlLabel>
            <FormControl
              type="text"
              className="form-control"
              value={icalUrl}
              onChange={this.handleTextChange}
            />
          </FormGroup>
          {error &&
            <HelpBlock className="text-error">{error}</HelpBlock>
          }
        </form>
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            disabled={!hasChanges}
            onClick={this.handleSave}
          >
            <LoaderContainer isLoading={inProgress}>
              Save
            </LoaderContainer>
          </Button>
        </ButtonToolbar>
      </div>
    );
  }
}

const mapDispatchToProps = {
  updateShortcutSettings,
};

export default connect(null, mapDispatchToProps)(IcalPage);
