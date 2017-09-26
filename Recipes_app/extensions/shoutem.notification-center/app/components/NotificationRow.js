import React from 'react';
import moment from 'moment';
import {
  TouchableOpacity,
  Row,
  Image,
  Subtitle,
  Caption,
  Divider,
  View,
} from '@shoutem/ui';

function NotificationRow({
  onPress,
  id,
  imageUrl,
  summary,
  timestamp,
}) {
  return (
    <TouchableOpacity key={id} onPress={onPress}>
      <Row>
        <Image
          styleName="small rounded-corners"
          source={{ uri: imageUrl }}
        />
        <View styleName="vertical stretch space-between">
          <Subtitle numberOfLines={2}>{summary}</Subtitle>
          <Caption>{moment(timestamp).fromNow()}</Caption>
        </View>
      </Row>
      <Divider styleName="line" />
    </TouchableOpacity>
  );
}

NotificationRow.propTypes = {
  onPress: React.PropTypes.func,
  id: React.PropTypes.number.isRequired,
  imageUrl: React.PropTypes.string.isRequired,
  summary: React.PropTypes.string.isRequired,
  timestamp: React.PropTypes.number.isRequired,
};

export default NotificationRow;
