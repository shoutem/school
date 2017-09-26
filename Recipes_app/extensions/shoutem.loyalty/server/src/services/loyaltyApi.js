import Uri from 'urijs';

export default class LoyaltyApi {
  constructor() {
    this.init = this.init.bind(this);
    this.isInitialized = this.isInitialized.bind(this);
    this.getUrl = this.getUrl.bind(this);

    this.endpoint = null;
  }

  init(endpoint) {
    if (!endpoint) {
      throw new Error('Loyalty endpoint cannot be empty!');
    }

    this.endpoint = endpoint;
  }

  isInitialized() {
    return !!this.endpoint;
  }

  getUrl(path = '') {
    return new Uri(path)
      .protocol(location.protocol)
      .host(this.endpoint)
      .toString();
  }
}
