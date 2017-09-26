import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { isBusy, clear } from '@shoutem/redux-io';
import { updateShortcutSettings, discoverFeeds, DISCOVERED_FEEDS } from './../reducer';
import { denormalizeCollection } from 'denormalizer';
import _ from 'lodash';
import normalizeUrl from 'normalize-url';
import FeedUrlInput from './FeedUrlInput';
import FeedSelector from './FeedSelector';
import FeedPreview from './FeedPreview';
import { ext } from 'context';
import { getShortcut } from 'environment';

const ACTIVE_SCREEN_INPUT = 0;
const ACTIVE_SCREEN_SELECT = 1;
const ACTIVE_SCREEN_PREVIEW = 2;

export class Rss extends Component {
  constructor(props) {
    super(props);
    this.getActiveScreen = this.getActiveScreen.bind(this);
    this.getFeedUrl = this.getFeedUrl.bind(this);
    this.setFeedUrl = this.setFeedUrl.bind(this);
    this.onFeedUrlInputContinueClick = this.onFeedUrlInputContinueClick.bind(this);
    this.onFeedRemoveClick = this.onFeedRemoveClick.bind(this);
    this.onFeedSelectAddClick = this.onFeedSelectAddClick.bind(this);
    this.onFeedSelectCancelClick = this.onFeedSelectCancelClick.bind(this);

    this.state = { discoverInProgress: false, error: '' };
  }

  componentWillReceiveProps(newProps) {
    if ((this.props.discoveredFeeds !== newProps.discoveredFeeds) &&
        !isBusy(newProps.discoveredFeeds)) {
      if (newProps.discoveredFeeds.length === 1) {
        this.onFeedSelectAddClick(newProps.discoveredFeeds[0].url);
        this.setState({
          discoverInProgress: false,
          error: '',
        });
      } else if (newProps.discoveredFeeds.length > 1) {
        this.setState({
          discoverInProgress: false,
          error: '',
        });
      } else {
        this.setState({
          discoverInProgress: false,
          error: this.state.discoverInProgress ? 'URL does not contain valid RSS feeds.' : '',
        });
      }
    }
  }

  onFeedUrlInputContinueClick(feedUrl) {
    this.setState({ discoverInProgress: true, error: '' });
    this.props.discoverFeeds(feedUrl);
  }

  onFeedRemoveClick() {
    const id = this.props.shortcut.id;
    const settings = { feedUrl: null };
    this.props.updateShortcutSettings(id, settings);
    this.props.clearDiscoverFeeds();
  }

  onFeedSelectAddClick(feedUrl) {
    this.setFeedUrl(feedUrl);
    this.props.clearDiscoverFeeds();
  }

  onFeedSelectCancelClick() {
    this.props.clearDiscoverFeeds();
  }

  setFeedUrl(feedUrl) {
    const id = this.props.shortcut.id;
    const normalizedFeedUrl = normalizeUrl(feedUrl);
    const settings = { feedUrl: normalizedFeedUrl };
    this.props.updateShortcutSettings(id, settings);
  }

  getFeedUrl() {
    if (this.props.shortcut && this.props.shortcut.settings) {
      return this.props.shortcut.settings.feedUrl;
    }
    return '';
  }

  getActiveScreen() {
    if (_.has(this.props, 'shortcut.settings.feedUrl')) {
      return ACTIVE_SCREEN_PREVIEW;
    } else if (this.props.discoveredFeeds.length > 1) {
      return ACTIVE_SCREEN_SELECT;
    }
    return ACTIVE_SCREEN_INPUT;
  }

  render() {
    const activeScreen = this.getActiveScreen();
    const feedUrl = this.getFeedUrl();

    return (
      <div>
        {(activeScreen === ACTIVE_SCREEN_INPUT) && (
          <FeedUrlInput
            inProgress={isBusy(this.props.discoveredFeeds)}
            error={this.state.error}
            onContinueClick={this.onFeedUrlInputContinueClick}
          />
        )}
        {(activeScreen === ACTIVE_SCREEN_SELECT) && (
          <FeedSelector
            discoveredFeeds={this.props.discoveredFeeds}
            onAddClick={this.onFeedSelectAddClick}
            onCancelClick={this.onFeedSelectCancelClick}
          />
        )}
        {(activeScreen === ACTIVE_SCREEN_PREVIEW) && (
          <FeedPreview
            feedUrl={feedUrl}
            onRemoveClick={this.onFeedRemoveClick}
          />
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    shortcut: getShortcut(),
    discoveredFeeds:
    denormalizeCollection(
      state[ext()].VimeoPage.discoveredFeeds,
      undefined,
      DISCOVERED_FEEDS,
    ),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateShortcutSettings: (id, settings) => dispatch(updateShortcutSettings(id, settings)),
    discoverFeeds: url => dispatch(discoverFeeds(url)),
    clearDiscoverFeeds: () => dispatch(clear(DISCOVERED_FEEDS, ext('discoveredFeeds'))),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Rss);
