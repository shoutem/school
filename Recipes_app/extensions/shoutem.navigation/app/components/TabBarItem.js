import React from 'react';
import { LayoutAnimation } from 'react-native';
import { connectStyle } from '@shoutem/theme';
import { ext } from '../const';
import { Touchable } from '@shoutem/ui';
import { NavigationBaseItem } from './NavigationBaseItem';

class TabBarItem extends NavigationBaseItem {
  render() {
    return (
      <Touchable
        onPress={this.onPress}
        styleName="flexible"
        style={this.props.style.item}
      >
        {this.renderIcon()}
        {this.renderText()}
      </Touchable>
    );
  }
}

const mapPropsToStyleNames = (styleNames, props) => {
  const customStyleNames = [];

  if (props.selected) {
    LayoutAnimation.easeInEaseOut();
    customStyleNames.push('selected');
  }

  if (props.showIcon && props.showText) {
    customStyleNames.push('icon-and-text');
  } else if (props.showIcon) {
    customStyleNames.push('icon-only');
  } else if (props.showText) {
    customStyleNames.push('text-only');
  }

  return [...styleNames, ...customStyleNames];
};

export default connectStyle(ext('TabBarItem'), undefined, mapPropsToStyleNames)(TabBarItem);
