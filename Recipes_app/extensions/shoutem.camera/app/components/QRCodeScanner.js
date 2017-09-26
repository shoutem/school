import React, {
  Component,
} from 'react';

import { Linking, Platform } from 'react-native';

import {
  Caption,
  View,
  Image,
  Button,
  Text,
} from '@shoutem/ui';

import { connectStyle } from '@shoutem/theme';

import Camera from 'react-native-camera';
import _ from 'lodash';

import { ext } from '../const';

const openAppSettings = () => {
  Linking.openURL('app-settings:');
};

const { func, object, shape } = React.PropTypes;

/**
 * A component that lets a user scan a QR code
 */
class QRCodeScanner extends Component {
  static propTypes = {
    // Called when a QR code has been successfully scanned
    onQRCodeScanned: func,
    // Component style,
    style: shape({
      cameraContainer: object,
      cameraFocusFrame: object,
      cameraView: object,
      noPermissionsMessage: object,
    }),
  }

  constructor(props) {
    super(props);

    this.updateIsAuthorized = this.updateIsAuthorized.bind(this);

    let isAuthorized = true;
    if (Platform.OS === 'ios') {
      // Asks for permissions if not defined, returns choice otherwise
      isAuthorized = undefined;
      Camera.checkDeviceAuthorizationStatus().then(this.updateIsAuthorized);
    }

    this.state = { isAuthorized };

    this.onQRCodeScanned = _.debounce(props.onQRCodeScanned, 1000, { leading: true, trailing: false });
  }

  updateIsAuthorized(isAuthorized) {
    this.setState({ isAuthorized });
  }

  /**
   * Show the Camera view only when needed permissions are granted.
   * react-native-camera package crash when camera permissions aren't granted.
   * @returns {*}
   */
  render() {
    const { isAuthorized } = this.state;
    const { style } = this.props;
    const cameraQuality = Camera.constants.CaptureQuality.medium;

    if (_.isUndefined(isAuthorized)) {
      // Permissions not resolved
      return null;
    }

    if (!isAuthorized) {
      // Permissions not granted
      return (
        <View style={style.cameraContainer}>
          <Caption
            style={style.noPermissionsMessage}
            styleName="lg-gutter-bottom"
          >
            Camera permission not granted.
          </Caption>
          <Button onPress={openAppSettings}>
            <Text>Change permissions</Text>
          </Button>
        </View>
      );
    }

    return (
      <View style={style.cameraContainer}>
        <Camera
          onBarCodeRead={this.onQRCodeScanned}
          style={style.cameraView}
          aspect={Camera.constants.Aspect.fill}
          captureQuality={cameraQuality}
        />
        <Image
          source={require('../assets/images/focus-frame.png')}
          style={style.cameraFocusFrame}
        />
      </View>
    );
  }
}

export default connectStyle(ext('QRCodeScanner'))(QRCodeScanner);
