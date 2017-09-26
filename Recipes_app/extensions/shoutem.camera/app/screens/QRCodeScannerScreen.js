import React, {
  Component,
} from 'react';

import {
  Screen,
} from '@shoutem/ui';

import { NavigationBar } from '@shoutem/ui/navigation';

import { connectStyle } from '@shoutem/theme';

import QRCodeScanner from '../components/QRCodeScanner.js';

import { ext } from '../const';

const { func, string } = React.PropTypes;

/**
 * A screen that lets a user scan a QR code
 */
class QRCodeScannerScreen extends Component {
  static propTypes = {
    // Called when a QR code has been successfully scanned
    onQRCodeScanned: func,
    // Screen title
    title: string,
  }

  render() {
    const { onQRCodeScanned, title } = this.props;

    return (
      <Screen>
        <NavigationBar title={title.toUpperCase()} />
        <QRCodeScanner onQRCodeScanned={onQRCodeScanned} />
      </Screen>
    );
  }
}

export default connectStyle(ext('QRCodeScannerScreen'))(QRCodeScannerScreen);
