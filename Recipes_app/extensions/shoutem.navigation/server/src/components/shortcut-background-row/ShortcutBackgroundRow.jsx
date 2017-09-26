import React, { PropTypes, Component } from 'react';
import { IconLabel } from '@shoutem/react-web-ui';
import { ImageUploader } from '@shoutem/web-core';
import { url, appId } from 'environment';
import { UndeletableS3Uploader } from '../../fileUpload';
import './style.scss';

function getLabelIcon(shortcutType) {
  switch (shortcutType) {
    case 'navigation':
      return 'folder';
    default:
      return 'screen';
  }
}

export default class ShortcutBackgroundRow extends Component {
  constructor(props) {
    super(props);

    this.handleNormalIconUploaded = this.handleNormalIconUploaded.bind(this);
    this.handleIconDeleted = this.handleIconDeleted.bind(this);

    this.uploader = new UndeletableS3Uploader({
      appId,
      basePolicyServerPath: url.apps,
      folderName: 'images',
    });
  }

  handleNormalIconUploaded(iconUrl) {
    const { shortcutId, onIconSelected } = this.props;
    onIconSelected(shortcutId, { normalIconUrl: iconUrl });
  }

  handleIconDeleted() {
    const { shortcutId, onIconSelected } = this.props;
    onIconSelected(shortcutId, { normalIconUrl: null });
  }

  render() {
    const { title, shortcutType, normalIconUrl } = this.props;
    const iconName = getLabelIcon(shortcutType);

    return (
      <tr className="shortcut-background-row">
        <td>
          <IconLabel iconName={iconName} size="24px" className="shortcuts-table__label">
            {title}
          </IconLabel>
        </td>
        <td>
          <ImageUploader
            uploader={this.uploader}
            onUploadSuccess={this.handleNormalIconUploaded}
            preview={normalIconUrl}
            previewSize="medium"
            onDeleteSuccess={this.handleIconDeleted}
          />
        </td>
      </tr>
    );
  }
}

ShortcutBackgroundRow.propTypes = {
  shortcutId: PropTypes.string,
  title: PropTypes.string,
  shortcutType: PropTypes.string,
  normalIconUrl: PropTypes.string,
  onIconSelected: PropTypes.func,
};
