import React, {
  Component,
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

import { createRenderAttachment } from 'shoutem.rss';

import { ext } from '../extension';

export class VimeoDetails extends Component {
  static propTypes = {
    // The video article to display
    video: React.PropTypes.object.isRequired,
  };

  render() {
    const { video } = this.props;
    const videoAttachment = _.head(video.videoAttachments);
    const VideoComponent = videoAttachment ?
      <Video source={{ uri: videoAttachment.src }} /> :
      null;

    return (
      <Screen styleName="paper">
        <NavigationBar
          share={{
            title: video.title,
            link: videoAttachment ? _.get(videoAttachment, 'src') : undefined,
          }}
          animationName="boxing"
          title={video.title}
        />

        <ScrollView>
          {VideoComponent}

          <Tile styleName="text-centric">
            <Title styleName="md-gutter-bottom">{video.title}</Title>
            <Caption>{moment(video.timeCreated).fromNow()}</Caption>
          </Tile>

          <View styleName="solid">
            <Html body={video.summary} renderElement={createRenderAttachment(video, 'video')} />
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export default connectStyle(ext('VimeoDetails'))(VimeoDetails);
