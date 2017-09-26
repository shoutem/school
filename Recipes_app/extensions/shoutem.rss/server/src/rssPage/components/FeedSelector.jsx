import React, { Component, PropTypes } from 'react';
import { Button, ButtonToolbar, Radio, FormGroup, ControlLabel } from 'react-bootstrap';
import './style.scss';

export default class FeedSelector extends Component {
  constructor(props) {
    super(props);
    this.onFeedChange = this.onFeedChange.bind(this);
    this.onAddClick = this.onAddClick.bind(this);

    this.state = { feed: null };
  }

  onFeedChange(event) {
    this.setState({
      feed: event.target.value
    });
  }

  onAddClick() {
    this.props.onAddClick(this.state.feed);
  }

  render() {
    const { discoveredFeeds, onCancelClick } = this.props;
    return (
      <div>
        <form>
          <FormGroup>
            <ControlLabel>Choose from available feeds</ControlLabel>
            <table className="table feed-selector__table">
              <tbody>
              {discoveredFeeds.map(feed => (
                <tr key={feed.url}>
                  <td>
                    <Radio
                      name="disovered-feed"
                      value={feed.url}
                      onClick={this.onFeedChange}
                    >
                      {feed.url}
                    </Radio>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </FormGroup>
        </form>
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            disabled={!this.state.feed}
            onClick={this.onAddClick}>
            Add feed
          </Button>
          <Button
            bsStyle="default"
            onClick={onCancelClick}>
            Cancel
          </Button>
        </ButtonToolbar>
      </div>
    );
  }
}

FeedSelector.propTypes = {
  discoveredFeeds: PropTypes.array,
  onAddClick: PropTypes.func,
  onCancelClick: PropTypes.func,
};
