import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { isBusy, clear, isInitialized } from '@shoutem/redux-io';
import _ from 'lodash';
import {
  fetchShortcut,
  updateShortcutSettings,
  getShortcut,
  fetchExtension,
  getExtension,
} from '@shoutem/redux-api-sdk';
import { LoaderContainer } from '@shoutem/react-web-ui';
import {
  FEED_ITEMS,
  loadFeed,
  getFeedItems,
} from '../../redux';
import FeedUrlInput from '../../components/feed-url-input';
import FeedPreview from '../../components/feed-preview';
import ext from '../../const';
import { validateYoutubeUrl } from '../../services/youtube';

const ACTIVE_SCREEN_INPUT = 0;
const ACTIVE_SCREEN_PREVIEW = 1;

export class YoutubeFeedPage extends Component {
  constructor(props) {
    super(props);

    this.getActiveScreen = this.getActiveScreen.bind(this);
    this.saveFeedUrl = this.saveFeedUrl.bind(this);
    this.handleFeedUrlInputContinueClick = this.handleFeedUrlInputContinueClick.bind(this);
    this.handleFeedPreviewRemoveClick = this.handleFeedPreviewRemoveClick.bind(this);

    const feedUrl = _.get(props.shortcut, 'settings.feedUrl');
    const apiKey = _.get(props.extension, 'settings.apiKey');

    this.state = {
      error: null,
      hasChanges: false,
      apiKey,
      feedUrl,
    };

    if (validateYoutubeUrl(feedUrl)) {
      this.fetchPosts({
        feedUrl,
        apiKey,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { shortcut: nextShortcut } = nextProps;
    const { extension: nextExtension } = nextProps;
    const { feedUrl } = this.state;

    // Must be check with "undefined" because _.isEmpty() will validate this clause
    // when feedUrl === null which is set when we want to clear { feedUrl } and this causes feedUrl
    // to be set even when user removed it.
    if (feedUrl === undefined) {
      const nextFeedUrl = _.get(nextShortcut, 'settings.feedUrl');
      const nextApiKey = _.get(nextExtension, 'settings.apiKey');

      this.setState({
        feedUrl: nextFeedUrl,
        apiKey: nextApiKey,
      });

      if (nextFeedUrl && validateYoutubeUrl(nextFeedUrl)) {
        nextProps.loadFeed(nextFeedUrl, nextApiKey, nextShortcut.id);
      }
    }
  }

  getActiveScreen() {
    const { feedUrl } = this.state;
    if (!_.isEmpty(feedUrl)) {
      return ACTIVE_SCREEN_PREVIEW;
    }
    return ACTIVE_SCREEN_INPUT;
  }

  saveFeedUrl(feedUrl) {
    const { shortcut } = this.props;
    const settings = { feedUrl };

    this.setState({ error: '', inProgress: true });
    this.props.updateShortcutSettings(shortcut, settings).then(() => {
      this.setState({ hasChanges: false, inProgress: false });
    }).catch((err) => {
      this.setState({ error: err, inProgress: false });
    });
  }

  fetchPosts({ feedUrl }) {
    const { apiKey } = this.state;
    const { shortcut } = this.props;

    if (!feedUrl || !apiKey || !shortcut) {
      return;
    }

    this.props.loadFeed(feedUrl, apiKey, shortcut.id).catch((err) => {
      this.setState({
        error: _.get(err, 'message'),
        inProgress: false,
      });
    });
  }

  handleFeedUrlInputContinueClick(feedUrl) {
    this.setState({
      feedUrl,
    });
    this.saveFeedUrl(feedUrl);
    this.fetchPosts({ feedUrl });
  }

  handleFeedPreviewRemoveClick() {
    this.setState({
      feedUrl: null,
    });

    this.saveFeedUrl(null);
    this.props.clearFeedItems();
  }

  render() {
    const activeScreen = this.getActiveScreen();
    const { feedUrl } = this.state;
    const { feedItems, shortcut } = this.props;
    const initialized = isInitialized(shortcut);

    return (
      <LoaderContainer isLoading={!initialized} className="youtube-feed-page">
        {(activeScreen === ACTIVE_SCREEN_INPUT) && (
          <FeedUrlInput
            inProgress={isBusy(feedItems)}
            error={this.state.error}
            onContinueClick={this.handleFeedUrlInputContinueClick}
          />
        )}
        {(activeScreen === ACTIVE_SCREEN_PREVIEW) && (
          <div className="youtube-feed-page__content">
            <FeedPreview
              feedUrl={feedUrl}
              feedItems={feedItems}
              onRemoveClick={this.handleFeedPreviewRemoveClick}
            />
          </div>
        )}
      </LoaderContainer>
    );
  }
}

YoutubeFeedPage.propTypes = {
  shortcut: PropTypes.object,
  extension: PropTypes.object,
  feedItems: PropTypes.array,
  fetchExtension: PropTypes.func,
  fetchShortcut: PropTypes.func,
  updateShortcutSettings: PropTypes.func,
  loadFeed: PropTypes.func,
  clearFeedItems: PropTypes.func,
};


function mapStateToProps(state, ownProps) {
  const { shortcutId } = ownProps;
  const extensionName = ext();

  return {
    extension: getExtension(state, extensionName),
    shortcut: getShortcut(state, shortcutId),
    feedItems: getFeedItems(state, extensionName, shortcutId),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { shortcutId } = ownProps;

  return {
    fetchExtension: () => dispatch(fetchExtension(ext())),
    fetchShortcut: () => dispatch(fetchShortcut(shortcutId)),
    updateShortcutSettings: (shortcut, { feedUrl }) => (
      dispatch(updateShortcutSettings(shortcut, { feedUrl }))),
    clearFeedItems: () => dispatch(clear(FEED_ITEMS, 'feedItems')),
    loadFeed: (url, apiKey) => dispatch(loadFeed(url, apiKey, shortcutId)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(YoutubeFeedPage);
