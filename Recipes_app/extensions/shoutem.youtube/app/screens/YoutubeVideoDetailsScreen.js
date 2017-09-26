import React, {
  PropTypes,
} from 'react';
import moment from 'moment';
import _ from 'lodash';

import {
  ScrollView,
  Title,
  Video,
  Screen,
  Caption,
  Tile,
  View,
  Html,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { NavigationBar } from '@shoutem/ui/navigation';

import { ext } from '../const';

class YoutubeVideoDetailsScreen extends React.Component {
  static propTypes = {
    video: PropTypes.object,
  }

  render() {
    const { video } = this.props;
    const playlistVideoSource = _.get(video, 'snippet.resourceId.videoId');
    const videoSource = _.get(video, 'id.videoId');
    const videoUrl = `https://youtube.com/watch?v=${playlistVideoSource || videoSource}`;
    const titleSource = _.get(video, 'snippet.title');
    const descriptionSource = _.get(video, 'snippet.description');
    const publishedAt = _.get(video, 'snippet.publishedAt');

    return (
      <Screen styleName="paper">
        <NavigationBar
          share={{
            title: titleSource,
            link: videoUrl,
          }}
          animationName="boxing"
          title={titleSource}
        />

        <ScrollView>
          <Video source={{ uri: videoUrl }} />
          <Tile styleName="text-centric">
            <Title styleName="md-gutter-bottom">{titleSource}</Title>
            <Caption>{moment(publishedAt).fromNow()}</Caption>
          </Tile>

          <View styleName="solid">
            <Html body={descriptionSource} />
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export default connectStyle(ext('YoutubeVideoDetailsScreen'))(YoutubeVideoDetailsScreen);
