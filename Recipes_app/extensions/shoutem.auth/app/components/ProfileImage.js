import React from 'react';

import {
  Icon,
  Image,
  TouchableOpacity,
  View,
} from '@shoutem/ui';

import { connectStyle } from '@shoutem/theme';

import { ext } from '../const';

/**
 * Displays a cart icon and a badge with number of items in it (if any).
 */
const ProfileImage = ({ isEditable, onPress, uri }) => (
  <View styleName="h-center lg-gutter-vertical solid vertical">
    <TouchableOpacity onPress={onPress}>
      <Image
        styleName="medium-avatar placeholder"
        source={{ uri }}
      >
        {isEditable ?
          <Icon
            name="take-a-photo"
            style={uri ? { color: '#ffffff' } : {}}
          />
          :
          null
        }
      </Image>
    </TouchableOpacity>
  </View>
);

const { bool, func, string } = React.PropTypes;

ProfileImage.propTypes = {
  // Determines whether the image should render an indicator that it can be edited
  isEditable: bool,
  // Called when the image is pressed
  onPress: func,
  // Image URI
  uri: string,
};

export default connectStyle(ext('ProfileImage'))(ProfileImage);
