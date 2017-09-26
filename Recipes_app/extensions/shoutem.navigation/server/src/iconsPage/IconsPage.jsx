import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { isInitialized } from '@shoutem/redux-io';
import { EmptyResourcePlaceholder, LoaderContainer } from '@shoutem/react-web-ui';
import { getShortcut } from 'environment';
import ShortcutsTable from '../components/shortcuts-table';
import ShortcutIconRow from '../components/shortcut-icon-row';
import { updateShortcut } from '../reducer';
import emptyImage from '../../assets/empty.png';
import { loadShortcuts } from './actions';

import './style.scss';

export class IconsPage extends Component {
  constructor(props) {
    super(props);
    this.handleIconChange = this.handleIconChange.bind(this);
    this.extractAllShortcuts = this.extractAllShortcuts.bind(this);
    this.renderShortcutRow = this.renderShortcutRow.bind(this);
    this.renderShortcutsTable = this.renderShortcutsTable.bind(this);
  }

  handleIconChange(shortcutId, changedIcon) {
    const { icon } = changedIcon;
    this.props.updateShortcut({
      id: shortcutId,
      attributes: { icon },
    });
  }

  extractAllShortcuts(shortcuts) {
    return _.reduce(shortcuts, (result, shortcut) => {
      if (_.isEmpty(shortcut.children)) {
        return [...result, shortcut];
      }

      return [
        ...result,
        shortcut,
        ...this.extractAllShortcuts(shortcut.children),
      ];
    }, []);
  }

  renderShortcutRow(shortcut) {
    return (
      <ShortcutIconRow
        shortcutType={shortcut.shortcutType}
        title={shortcut.title}
        icon={shortcut.icon}
        shortcutId={shortcut.id}
        onIconSelected={this.handleIconChange}
      />
    );
  }

  renderShortcutsTable(shortcuts) {
    if (!shortcuts || shortcuts.length === 0) {
      return (
        <EmptyResourcePlaceholder
          className="icons-page__empty-placeholder"
          imageSrc={emptyImage}
          title="Navigation is empty"
        >
          <span>Start adding screens. They will appear in your main navigation!</span>
        </EmptyResourcePlaceholder>
      );
    }

    return (
      <ShortcutsTable
        className="icons-page__shortcuts-table"
        shortcuts={shortcuts}
        headerTitles={['Navigation item', 'Icon']}
        renderRow={this.renderShortcutRow}
      />
    );
  }

  render() {
    const { shortcut } = this.props;
    const shortcuts = this.extractAllShortcuts(shortcut.children);

    return (
      <LoaderContainer className="icons-page" isLoading={!isInitialized(shortcut)}>
        {this.renderShortcutsTable(shortcuts)}
      </LoaderContainer>
    );
  }
}

IconsPage.propTypes = {
  shortcut: PropTypes.object.isRequired,
  updateShortcut: PropTypes.func.isRequired,
};


function mapStateToProps() {
  const shortcut = getShortcut();
  return {
    shortcut,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadShortcuts: () => dispatch(loadShortcuts()),
    updateShortcut: (shortcut) => dispatch(updateShortcut(shortcut)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IconsPage);
