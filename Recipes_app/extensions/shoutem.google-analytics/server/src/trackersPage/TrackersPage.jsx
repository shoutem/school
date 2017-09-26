import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { getExtensionInstallation } from 'environment';
import { EditableTable, IconLabel } from '@shoutem/react-web-ui';
import { Button } from 'react-bootstrap';
import {
  getExtensionSettings,
  updateExtensionSettings,
} from '../builder-sdk';
import './style.scss';

const TABLE_HEADERS = ['Tracker ID*', 'View ID', 'Sampling rate', ''];
const TABLE_ROW_DESCRIPTORS = [
  { property: 'trackerId', isRequired: true },
  { property: 'viewId', isRequired: false },
  { property: 'samplingRate', isRequired: false },
];

export class TrackersPage extends Component {
  constructor(props) {
    super(props);

    this.handleAddNewTracker = this.handleAddNewTracker.bind(this);
    this.handleUpdateTrackers = this.handleUpdateTrackers.bind(this);
  }

  handleAddNewTracker() {
    this.refs.trackersTable.addNewRow();
  }

  handleUpdateTrackers(trackers) {
    const { extensionInstallation, updateSettings } = this.props;
    return updateSettings(extensionInstallation, { trackers });
  }

  render() {
    const { extensionInstallation } = this.props;
    const settings = getExtensionSettings(extensionInstallation);

    return (
      <div className="trackers-page">
        <div className="trackers-page__title">
          <h3>Google Analytics Trackers</h3>
          <Button
            className="btn-icon pull-right"
            onClick={this.handleAddNewTracker}
          >
            <IconLabel iconName="add">
              Add tracker
            </IconLabel>
          </Button>
        </div>
        <EditableTable
          ref="trackersTable"
          className="trackers-page__table"
          rows={settings.trackers}
          onRowsUpdated={this.handleUpdateTrackers}
          headers={TABLE_HEADERS}
          rowDescriptors={TABLE_ROW_DESCRIPTORS}
        />
      </div>
    );
  }
}

TrackersPage.propTypes = {
  extensionInstallation: PropTypes.object,
  updateSettings: PropTypes.func,
};

function mapStateToProps() {
  return {
    extensionInstallation: getExtensionInstallation(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateSettings: (extension, settings) => dispatch(updateExtensionSettings(extension, settings)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TrackersPage);
