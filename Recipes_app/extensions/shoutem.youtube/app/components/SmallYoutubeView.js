import React from 'react';
import _ from 'lodash';
import moment from 'moment';

import {
  TouchableOpacity,
  Row,
  Subtitle,
  Caption,
  View,
  Image,
  Overlay,
  Icon,
  Divider,
} from '@shoutem/ui';

import getImageSource from '../services/youtube-view';


/**
 * A component used to render a single list video item as a row
 * in a list with a medium sized thumbnail.
 */
export default class SmallYoutubeView extends React.Component {
  static propTypes = {
    onPress: React.PropTypes.func,
    video: React.PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    this.props.onPress(this.props.video);
  }

  render() {
    const { video } = this.props;
    const titleSource = _.get(video, 'snippet.title');
    const publishedAt = _.get(video, 'snippet.publishedAt');

    return (
      <TouchableOpacity onPress={this.onPress}>
        <Row>
          <Image
            styleName="medium rounded-corners placeholder"
            source={{ uri: getImageSource(video) }}
          >
            <Overlay styleName="rounded-small">
              <Icon name="play" />
            </Overlay>
          </Image>

          <View styleName="vertical stretch space-between">
            <Subtitle numberOfLines={3}>{titleSource}</Subtitle>
            <Caption>{moment(publishedAt).fromNow()}</Caption>
          </View>
        </Row>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}
