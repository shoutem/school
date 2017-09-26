import { connect } from 'react-redux';
import React from 'react';
import _ from 'lodash';

import {
  find,
  next,
} from '@shoutem/redux-io';

import { navigateTo } from '@shoutem/core/navigation';
import { RssListScreen } from 'shoutem.rss';

import { RSS_VIDEOS_SCHEMA, getVideosFeed } from '../redux';
import { ext } from '../const';

import LargeVideoView from '../components/LargeVideoView';

export class VideosList extends RssListScreen {
  static propTypes = {
    ...RssListScreen.propTypes,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      ...this.state,
      schema: RSS_VIDEOS_SCHEMA,
    };

    this.openDetailsScreen = this.openDetailsScreen.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  openDetailsScreen(video) {
    const { navigateTo, feedUrl } = this.props;
    const route = {
      screen: ext('VideoDetails'),
      props: {
        video,
        feedUrl,
      },
    };

    navigateTo(route);
  }

  renderRow(video) {
    return (
      <LargeVideoView video={video} onPress={this.openDetailsScreen} />
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const feedUrl = _.get(ownProps, 'shortcut.settings.feedUrl');
  return {
    feedUrl,
    data: getVideosFeed(state, feedUrl),
  };
};

export const mapDispatchToProps = { navigateTo, find, next };

export default connect(mapStateToProps, mapDispatchToProps)(VideosList);
