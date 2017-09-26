import React from 'react';
import { NavigationBaseItem } from './NavigationBaseItem';
import { FolderItemContainer } from './FolderItemContainer';

/**
 * Do not connect to style. Style it trough List screen so dimension related style can be
 * used to calculate list dimensions.
 */
export default class CardListItem extends NavigationBaseItem {
  render() {
    const { style, styleName, showBackground } = this.props;
    const shortcutSettings = this.getShortcutLayoutSettings('cardList');
    const backgroundImageUrl = showBackground ? shortcutSettings.normalIconUrl : undefined;
    return (
      <FolderItemContainer
        onPress={this.onPress}
        style={style.item}
        styleName={styleName}
        backgroundImageUrl={backgroundImageUrl}
      >
        {this.renderText()}
      </FolderItemContainer>
    );
  }
}
