import React from 'react';
import { connect } from 'react-redux';

import { connectStyle } from '@shoutem/theme';
import { navigateTo } from '@shoutem/core/navigation';

import { CmsListScreen } from 'shoutem.cms';

import { ext } from '../const';
import { VIDEOS_SCHEMA } from '../redux';
import LargeVideoView from '../components/LargeVideoView';

export class VideosList extends CmsListScreen {
  static propTypes = {
    ...CmsListScreen.propTypes,
    navigateTo: React.PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.openDetailsScreen = this.openDetailsScreen.bind(this);
    this.renderRow = this.renderRow.bind(this);

    this.state = {
      ...this.state,
      schema: VIDEOS_SCHEMA,
    };
  }

  openDetailsScreen(video) {
    const route = {
      screen: ext('VideoDetails'),
      props: { video },
    };

    this.props.navigateTo(route);
  }

  renderRow(video) {
    return (
      <LargeVideoView
        video={video}
        onPress={this.openDetailsScreen}
      />
    );
  }
}

export const mapStateToProps = CmsListScreen.createMapStateToProps(
  state => state[ext()].latestVideos,
);

export const mapDispatchToProps = CmsListScreen.createMapDispatchToProps({
  navigateTo,
});

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('VideosList'))(VideosList),
);
