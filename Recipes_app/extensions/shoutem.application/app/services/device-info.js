import DeviceInfo from 'react-native-device-info';

export default {
  getDeviceId: DeviceInfo.getDeviceId,
  getDeviceName: DeviceInfo.getDeviceName,
  getUniqueDeviceId: DeviceInfo.getUniqueID,
  getManufacturer: DeviceInfo.getManufacturer,
  getBrand: DeviceInfo.getBrand,
  getModel: DeviceInfo.getModel,
  getSystemName: DeviceInfo.getSystemName,
  getSystemVersion: DeviceInfo.getSystemVersion,
  getBundleId: DeviceInfo.getBundleId,
  getBuildNumber: DeviceInfo.getBuildNumber,
  getVersion: DeviceInfo.getVersion,
  getReadableVersion: DeviceInfo.getReadableVersion,
  getUserAgent: DeviceInfo.getUserAgent,
  getDeviceLocale: DeviceInfo.getDeviceLocale,
  getDeviceCountry: DeviceInfo.getDeviceCountry,
  getTimezone: DeviceInfo.getTimezone,
  getHourFormat: DeviceInfo.getHourFormat,

  // Hour format constants
  HOUR_FORMAT: DeviceInfo.HOUR_FORMAT,

  // ANDROID ONLY - see https://developers.google.com/instance-id/
  getInstanceId: DeviceInfo.getInstanceID,
  // END: ANDROID ONLY

  isEmulator: DeviceInfo.isEmulator,
  isTablet: DeviceInfo.isTablet,
  isPinOrFingerprintSet: DeviceInfo.isPinOrFingerprintSet,
};
