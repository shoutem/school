import React from 'react';
import { NavigationBaseItem } from './NavigationBaseItem';
import { FolderItemContainer } from './FolderItemContainer';
import { Icon, View } from '@shoutem/ui';

/**
 * Do not connect to style. Style it trough List screen so dimension related style can be
 * used to calculate list dimensions.
 */
export default class ListItem extends NavigationBaseItem {
  render() {
    const { style } = this.props;
    return (
      <FolderItemContainer
        onPress={this.onPress}
        style={style.item}
      >
        <View style={style.iconAndTextContainer}>
          {this.renderIcon()}
          {this.renderText()}
        </View>
        <View style={style.chevronContainer}>
          <Icon name="right-arrow" style={style.chevron} />
        </View>
      </FolderItemContainer>
    );
  }
}
