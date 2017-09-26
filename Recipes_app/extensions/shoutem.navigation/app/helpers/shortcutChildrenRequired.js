import React from 'react';
import _ from 'lodash';
import { navigateTo } from '@shoutem/core/navigation';
import NoScreens from '../screens/NoScreens';
import NoContent from '../screens/NoContent';
import mapIsRootScreenToProps from './mapIsRootScreenToProps';
import mapExtensionSettingsToProps from './mapExtensionSettingsToProps';
import { connect } from 'react-redux';

/**
 * Navigation shortcuts, such as Drawer, Folder, TabBar, must have child shortcuts.
 * Use it as a fallback for navigation screen if shortcuts (children) are missing.
 */
function ShortcutChildrenRequired(props) {
  const { WrappedComponent, shortcut, isRootScreen } = props;

  // Folder screen may not be root screen and if it has no children
  // we present error as there is no content.
  const fallbackScreen = isRootScreen ? <NoScreens /> : <NoContent title={shortcut.title} />;

  return _.isEmpty(shortcut.children) ?
    fallbackScreen :
    <WrappedComponent {...props} />;
}

ShortcutChildrenRequired.propTypes = {
  shortcut: React.PropTypes.object.isRequired,
  isRootScreen: React.PropTypes.bool,
  WrappedComponent: React.PropTypes.func,
};

const mapStateToProps = (state, ownProps) => ({
  ...mapIsRootScreenToProps(state, ownProps),
  ...mapExtensionSettingsToProps(state, ownProps),
});

const ConnectedShortcutChildrenRequired =
  connect(mapStateToProps, { navigateTo })(
  ShortcutChildrenRequired
);

export default (WrappedComponent) => props =>
  <ConnectedShortcutChildrenRequired {...props} WrappedComponent={WrappedComponent} />;
