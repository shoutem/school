import React from 'react';
import { connect } from 'react-redux';

import { connectStyle } from '@shoutem/theme';

import { ext } from '../const';

import { VideosList, mapStateToProps, mapDispatchToProps } from './VideosList';
import SmallVideoView from '../components/SmallVideoView';

class SmallVideosList extends VideosList {
  renderRow(video) {
    return (
      <SmallVideoView video={video} onPress={this.openDetailsScreen} />
    );
  }
}

export default connectStyle(ext('SmallVideosList'))(
  connect(mapStateToProps, mapDispatchToProps)(SmallVideosList),
);
