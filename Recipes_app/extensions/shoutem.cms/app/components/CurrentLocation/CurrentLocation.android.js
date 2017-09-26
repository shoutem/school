import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { PermissionsAndroid } from 'react-native';
import CurrentLocationBase from './CurrentLocationBase';

export default function (WrappedComponent) {
  class CurrentLocation extends CurrentLocationBase {
    constructor(props) {
      super(props);

      this.requestPermission = this.requestPermission.bind(this);
    }

    checkPermissionStatus() {
      const { permissionStatus } = this.props;
      const permission = _.get(permissionStatus, 'permission');

      if (!permission) {
        this.requestPermission();
        return;
      }

      super.checkPermissionStatus();
    }

    requestPermission() {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          /* eslint-disable quote-props */
          'title': 'Location Permission',
          'message': 'This app needs access to  your location ' +
          'to display relevant data',
          /* eslint-enable quote-props */
        }
      ).then(() => {
        super.checkPermissionStatus();
      }).catch((err) => {
        console.warn(err);
      });
    }

    promptForLocationPermission() {
      const alert = 'You disabled location permissions for this application.' +
        'Do you want to enable it now?';
      const confirmationMessage = 'Enable';

      super.promptForLocationPermission(alert, confirmationMessage, this.requestPermission);
    }

    render() {
      const { currentLocation } = this.state;

      return (
        <WrappedComponent
          {...this.props}
          currentLocation={currentLocation}
          checkPermissionStatus={this.checkPermissionStatus}
        />
      );
    }
  }

  return connect(
    CurrentLocationBase.mapStateToProps,
    CurrentLocationBase.mapDispatchToProps,
  )(CurrentLocation);
}

