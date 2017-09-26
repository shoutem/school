import { closeModal, navigateTo, openInModal } from '@shoutem/core/navigation';

import {
  ext,
} from './const';

const getQRCodeScannerRoute = (onQRCodeScanned, title) => ({
  screen: ext('QRCodeScannerScreen'),
  props: {
    onQRCodeScanned,
    title,
  },
});

/**
 * Opens a screen to scan a QR code in a modal.
 * Triggers a callback function when a code has been scanned.
 */
export const scanQRCode = (onQRCodeScanned, title) => (dispatch) => {
  const callback = (code) => {
    if (code.data) {
      dispatch(closeModal());
      onQRCodeScanned(code.data);
    }
  };

  dispatch(openInModal(getQRCodeScannerRoute(callback, title)));
};

/**
 * Navigates to QR Code scanner screen
 */
export const navigateToQRCodeScannerScreen = (onQRCodeScanned, title) => (dispatch) => {
  dispatch(navigateTo(getQRCodeScannerRoute(onQRCodeScanned, title)));
};
