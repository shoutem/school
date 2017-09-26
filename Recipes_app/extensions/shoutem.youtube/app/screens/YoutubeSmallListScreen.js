import React from 'react';
import { connect } from 'react-redux';

import { connectStyle } from '@shoutem/theme';

import { ext } from '../const';

import { YoutubeVideosScreen, mapStateToProps, mapDispatchToProps } from './YoutubeVideosScreen';
import SmallYoutubeView from '../components/SmallYoutubeView';

class YoutubeSmallListScreen extends YoutubeVideosScreen {
  renderRow(video) {
    return (
      <SmallYoutubeView video={video} onPress={this.openDetailsScreen} />
    );
  }
}

export default connectStyle(ext('YoutubeSmallListScreen'))(
  connect(mapStateToProps, mapDispatchToProps)(YoutubeSmallListScreen),
);
