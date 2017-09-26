import { connect } from 'react-redux';
import React from 'react';
import _ from 'lodash';

import {
  find,
  next,
} from '@shoutem/redux-io';

import { navigateTo } from '@shoutem/core/navigation';
import { RssListScreen } from 'shoutem.rss';

import { VIMEO_SCHEMA, getVimeoFeed } from '../redux';
import { ext } from '../extension';

import LargeVimeoView from '../components/LargeVimeoView';

export class VimeoList extends RssListScreen {
  static propTypes = {
    ...RssListScreen.propTypes,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      ...this.state,
      schema: VIMEO_SCHEMA,
    };

    this.openDetailsScreen = this.openDetailsScreen.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  openDetailsScreen(video) {
    const { navigateTo, feedUrl } = this.props;
    const route = {
      screen: ext('VimeoDetails'),
      props: {
        video,
        feedUrl,
      },
    };

    navigateTo(route);
  }

  renderRow(video) {
    return (
      <LargeVimeoView video={video} onPress={this.openDetailsScreen} />
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const feedUrl = _.get(ownProps, 'shortcut.settings.feedUrl');
  return {
    feedUrl,
    data: getVimeoFeed(state, feedUrl),
  };
};

export const mapDispatchToProps = { navigateTo, find, next };

export default connect(mapStateToProps, mapDispatchToProps)(VimeoList);
