import React, {
  Component,
} from 'react';
import moment from 'moment';

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

import { ext } from '../const';

export class VideoDetails extends Component {
  static propTypes = {
    // The video article to display
    video: React.PropTypes.object.isRequired,
  };

  render() {
    const { video } = this.props;

    const videoAttachment = video.videoAttachments.length > 0 ? video.videoAttachments[0] : null;

    const videoComponent =
      videoAttachment ? <Video source={{ uri: videoAttachment.src }} /> : null;

    return (
      <Screen styleName="paper">
        <NavigationBar
          share={{
            title: video.title,
            link: videoAttachment ? videoAttachment.src : '',
          }}
          animationName="boxing"
          title={video.title}
        />

        <ScrollView>
          {videoComponent}

          <Tile styleName="text-centric">
            <Title styleName="md-gutter-bottom">{video.title}</Title>
            <Caption>{moment(video.timeCreated).fromNow()}</Caption>
          </Tile>

          <View styleName="solid">
            <Html body={video.body} renderElement={createRenderAttachment(video, 'video')} />
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export default connectStyle(ext('VideoDetails'))(VideoDetails);
