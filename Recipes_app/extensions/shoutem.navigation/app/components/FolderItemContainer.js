import React from 'react';
import _ from 'lodash';
import { resolveIconSource } from 'shoutem.theme';
import { TouchableOpacity, Image } from '@shoutem/ui';

/**
 * Used to set Folder item background.
 * Wraps Folder children with Image if Folder item has background.
 */
export function FolderItemContainer(props) {
  const { children, backgroundImageUrl, style } = props;
  const touchableOpacityProps = _.omit(props, ['children', 'backgroundImageUrl']);
  delete touchableOpacityProps.style.backgroundImage;

  const backgroundImageComponent = backgroundImageUrl &&
    <Image
      styleName="fill-parent"
      style={style.backgroundImage}
      source={resolveIconSource(backgroundImageUrl)}
    />;

  return (
    <TouchableOpacity {...touchableOpacityProps}>
      {backgroundImageComponent}
      {children}
    </TouchableOpacity>
  );
}

FolderItemContainer.propTypes = {
  style: React.PropTypes.object,
  children: React.PropTypes.node,
  onPress: React.PropTypes.func,
  styleName: React.PropTypes.string,
  backgroundImageUrl: React.PropTypes.string,
  shortcutSettings: React.PropTypes.object,
};

FolderItemContainer.defaultProps = {
  shortcutSettings: {},
};
