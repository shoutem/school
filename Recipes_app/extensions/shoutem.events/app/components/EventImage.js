import React from 'react';
import { Image } from '@shoutem/ui';
import _ from 'lodash';

function EventImage(props) {
  return (
    <Image
      {...props}
      styleName={`placeholder ${props.styleName}`}
      source={{ uri: _.get(props.event, 'image.url') }}
    >
      {props.children}
    </Image>
  );
}

EventImage.propTypes = {
  event: React.PropTypes.object,
  styleName: React.PropTypes.string,
  animationName: React.PropTypes.string,
  children: React.PropTypes.node,
};

export default EventImage;
