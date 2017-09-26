import React from 'react';
import moment from 'moment';

import {
  ScrollView,
  Title,
  Video,
  Screen,
  Caption,
  Html,
  Tile,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { NavigationBar } from '@shoutem/ui/navigation';

import { ext } from '../const';

function VideoDetails({ video }) {
  return (
    <Screen styleName="paper">
      <NavigationBar
        share={{
          title: video.name,
          link: video.video.url,
        }}
        title={video.name}
        animationName="boxing"
      />
      <ScrollView>
        <Video source={{ uri: video.video.url }} />

        <Tile styleName="text-centric">
          <Title styleName="md-gutter-bottom">{video.name}</Title>
          <Caption>
            {moment(video.timeCreated).fromNow()}{video.duration ? `    ${video.duration}` : ''}
          </Caption>
        </Tile>

        <Html body={video.description} />
      </ScrollView>
    </Screen>
  );
}

VideoDetails.propTypes = {
  video: React.PropTypes.object.isRequired,
};

export default connectStyle(ext('VideoDetails'))(VideoDetails);

