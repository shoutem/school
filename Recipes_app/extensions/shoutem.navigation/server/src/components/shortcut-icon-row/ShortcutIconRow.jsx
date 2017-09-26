import React, { PropTypes, Component } from 'react';
import { IconLabel } from '@shoutem/react-web-ui';
import { IconPicker } from '@shoutem/web-core';
import {
  url,
  appId,
  getActiveTheme,
  getDefaultTheme,
} from 'environment';
import { UndeletableS3Uploader } from '../../fileUpload';

function getLabelIcon(shortcutType) {
  switch (shortcutType) {
    case 'navigation':
      return 'folder';
    default:
      return 'screen';
  }
}

export default class ShortcutIconRow extends Component {
  constructor(props) {
    super(props);
    this.handleIconSelected = this.handleIconSelected.bind(this);

    this.uploader = new UndeletableS3Uploader({
      appId,
      basePolicyServerPath: url.apps,
      folderName: 'icons',
    });
  }

  handleIconSelected(icon) {
    const { shortcutId, onIconSelected } = this.props;
    onIconSelected(shortcutId, { icon });
  }

  render() {
    const { shortcutType, title, icon } = this.props;
    const iconName = getLabelIcon(shortcutType);
    const activeTheme = getActiveTheme();
    const defaultTheme = getDefaultTheme();

    return (
      <tr>
        <td>
          <IconLabel iconName={iconName} size="24px" className="shortcuts-table__label">
            {title}
          </IconLabel>
        </td>
        <td>
          <IconPicker
            appId={appId}
            activeTheme={activeTheme}
            defaultTheme={defaultTheme}
            preview={icon}
            onSelect={this.handleIconSelected}
            uploader={this.uploader}
          />
        </td>
      </tr>
    );
  }
}

ShortcutIconRow.propTypes = {
  shortcutId: PropTypes.string,
  title: PropTypes.string,
  shortcutType: PropTypes.string,
  icon: PropTypes.string,
  onIconSelected: PropTypes.func,
};
