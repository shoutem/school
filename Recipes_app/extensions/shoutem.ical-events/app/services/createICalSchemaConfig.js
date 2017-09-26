export const schema = 'shoutem.proxy.ical.events';

const defaultEndpoint = 'https://proxy.api.shoutem.com/v1/proxy/ical/events';
export default function (endpoint = defaultEndpoint) {
  return {
    schema,
    request: {
      endpoint,
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };
}
