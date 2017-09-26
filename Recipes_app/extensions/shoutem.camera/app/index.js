import QRCodeScanner from './components/QRCodeScanner.js';
import QRCodeScannerScreen from './screens/QRCodeScannerScreen.js';

export const screens = {
  QRCodeScannerScreen,
};

export {
  navigateToQRCodeScannerScreen,
  scanQRCode,
} from './redux';

export { QRCodeScanner };
