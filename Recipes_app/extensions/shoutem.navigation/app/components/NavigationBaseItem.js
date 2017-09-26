import React from 'react';
import _ from 'lodash';
import { resolveIconSource } from 'shoutem.theme';

import {
  Text,
  Image,
} from '@shoutem/ui';

const missingIconSource = require('../assets/images/missing_icon.png');

const { bool, func, object } = React.PropTypes;

export class NavigationBaseItem extends React.Component {
  static propTypes = {
    /* eslint-disable react/forbid-prop-types */
    shortcut: object.isRequired,
    style: object,
    showText: bool,
    showIcon: bool,
    onPress: func,
  };

  static defaultProps = {
    showIcon: true,
  };

  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    // Delay the onPress handler so that we can
    // display the touch animations without blocking ui

    /* eslint-disable-next-line no-undef */
    requestAnimationFrame(() => this.props.onPress(this.props.shortcut));
  }

  getShortcutLayoutSettings(layoutName, props = this.props) {
    const { shortcut } = props;
    return _.get(shortcut, ['settings', 'navigation', layoutName], {});
  }

  resolveIconProps() {
    const { style, shortcut: { icon } } = this.props;

    const iconStyle = { ...style.icon };

    if (icon && icon.split('.').pop() !== 'png') {
       // If it's not a PNG icon, remove tint color
      iconStyle.tintColor = undefined;
    }

    const source = icon ? resolveIconSource(icon) : missingIconSource;

    return {
      style: iconStyle,
      source,
    };
  }

  resolveTextProps() {
    const { style } = this.props;
    return {
      style: style.text,
      numberOfLines: 1,
      styleName: 'center regular',
    };
  }

  renderIcon() {
    const { showIcon } = this.props;

    if (!showIcon) {
      return null;
    }

    return <Image {...this.resolveIconProps()} />;
  }

  renderText() {
    const { shortcut, showText } = this.props;
    if (!showText) {
      return null;
    }
    return (
      <Text {...this.resolveTextProps()}>
        {shortcut.title}
      </Text>
    );
  }
}
