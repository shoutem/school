const UNIVERSAL_DEVICE_ID = 'universal';

let endpointProvider = {};

const initialize = (legacyApiEndpointBase, appId) => {
  if (!legacyApiEndpointBase || !appId) {
    throw new Error(`Unable to initialize Endpoint on ${legacyApiEndpointBase} for app ${appId}`);
  }

  const notificationsUrl = `${legacyApiEndpointBase}/${appId}/notifications/functions/`;
  const inbox = `${notificationsUrl}/getInbox?device_id=${UNIVERSAL_DEVICE_ID}`;
  const markAsRead = `${notificationsUrl}/read?device_id=${UNIVERSAL_DEVICE_ID}`;

  const groups = `${legacyApiEndpointBase}/${appId}/notifications/objects/Group?device_id=${UNIVERSAL_DEVICE_ID}`;
  const selectedGroups = `${legacyApiEndpointBase}/${appId}/firebase/objects/Topics?deviceToken={deviceToken}`;

  endpointProvider = {
    groups,
    inbox,
    markAsRead,
    selectedGroups,
  };
};

export {
  initialize,
};

export default () => endpointProvider;
