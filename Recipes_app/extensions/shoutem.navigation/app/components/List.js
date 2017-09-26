import React from 'react';
import { connectStyle } from '@shoutem/theme';
import { LIST } from '../const';
import ListItem from './ListItem';
import FolderBase from './FolderBase';

class List extends FolderBase {
  static propTypes = {
    ...FolderBase.propTypes,
    // TODO(Braco) - update props
    listAlignment: React.PropTypes.string,
    topOffset: React.PropTypes.number,
    showText: React.PropTypes.bool,
    backgroundImage: React.PropTypes.string,
  };

  resolvePageProps() {
    const { topOffset, listAlignment } = this.getLayoutSettings();
    const { dimensions: { height } } = this.state;
    const { style } = this.props;
    return {
      style: {
        paddingTop: topOffset,
        // Min height stretch page so list can be vertically aligned
        minHeight: height,
        ...style.page,
      },
      styleName: listAlignment,
    };
  }

  renderRow(shortcut, index) {
    const { showText, showIcon, inItemAlignment } = this.getLayoutSettings();
    const { style } = this.props;
    return (
      <ListItem
        key={`item_${index}`}
        showText={showText}
        showIcon={showIcon}
        shortcut={shortcut}
        inItemAlignment={inItemAlignment}
        onPress={this.itemPressed}
        style={style}
      />
    );
  }
}

const mapPropsToStyleNames = (styleNames, props) => {
  const { inItemAlignment } = props;

  // Add inItemAlignment as style name to align content
  styleNames.push(`in-item-alignment-${inItemAlignment}`);

  return FolderBase.mapPropsToStyleNames(styleNames, props);
};

export default connectStyle(LIST, undefined, mapPropsToStyleNames)(List);
