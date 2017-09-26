import React from 'react';
import { executeShortcut } from 'shoutem.application';
import { connect } from 'react-redux';
import {
  replace,
  REPLACE,
  ROOT_NAVIGATION_STACK,
} from '@shoutem/core/navigation';
import { NO_SCREENS_ROUTE } from '../const';

class None extends React.Component {
  static propTypes = {
    shortcut: React.PropTypes.object.isRequired,
    executeShortcut: React.PropTypes.func,
    replace: React.PropTypes.func,
  };
  componentWillMount() {
    const { shortcut, replace, executeShortcut } = this.props;
    const children = shortcut.children || [];

    if (!children[0]) {
      replace(NO_SCREENS_ROUTE, ROOT_NAVIGATION_STACK);
      return;
    }

    const shortcutId = children[0].id;

    executeShortcut(shortcutId, REPLACE);
  }

  render() {
    return null;
  }
}
export default connect(undefined, { executeShortcut, replace })(None);
