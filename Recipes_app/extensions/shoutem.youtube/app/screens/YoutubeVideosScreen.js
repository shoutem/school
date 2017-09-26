import { connect } from 'react-redux';
import React from 'react';
import _ from 'lodash';

import { ListView } from '@shoutem/ui';
import {
  next,
  isBusy,
  isInitialized,
} from '@shoutem/redux-io';
import { navigateTo } from '@shoutem/core/navigation';

import { getExtensionSettings } from 'shoutem.application';
import { RssListScreen } from 'shoutem.rss';

import { ext } from '../const';
import { YOUTUBE_VIDEOS_SCHEMA, getVideosFeed, fetchFeed } from '../redux';
import LargeYoutubeView from '../components/LargeYoutubeView';

export class YoutubeVideosScreen extends RssListScreen {
  static propTypes = {
    ...RssListScreen.propTypes,
    fetchFeed: React.PropTypes.func,
    data: React.PropTypes.array,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      ...this.state,
      schema: YOUTUBE_VIDEOS_SCHEMA,
    };
    this.openDetailsScreen = this.openDetailsScreen.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderData = this.renderData.bind(this);
  }

  openDetailsScreen(video) {
    const { navigateTo, feedUrl } = this.props;
    const route = {
      screen: ext('YoutubeVideoDetailsScreen'),
      props: {
        video,
        feedUrl,
      },
    };

    navigateTo(route);
  }

  fetchData() {
    const { feedUrl, apiKey } = this.props;

    if (_.isEmpty(feedUrl)) {
      return;
    }

    this.props.fetchFeed(feedUrl, apiKey);
  }

  renderRow(video) {
    return (
      <LargeYoutubeView
        video={video}
        onPress={this.openDetailsScreen}
      />
    );
  }

  renderData(data) {
    return (
      <ListView
        data={data}
        renderRow={this.renderRow}
        loading={isBusy(data) || !isInitialized(data)}
        onRefresh={this.fetchData}
        onLoadMore={this.loadMore}
      />
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const feedUrl = _.get(ownProps, 'shortcut.settings.feedUrl');
  const { apiKey } = getExtensionSettings(state, ext());

  return {
    feedUrl,
    apiKey,
    data: getVideosFeed(state, feedUrl),
  };
};

export const mapDispatchToProps = { navigateTo, fetchFeed, next };

export default connect(mapStateToProps, mapDispatchToProps)(YoutubeVideosScreen);
