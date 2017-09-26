import Uri from 'urijs';
import _ from 'lodash';

export default class CmsApi {
  constructor() {
    this.init = this.init.bind(this);
    this.initSession = this.initSession.bind(this);
    this.isInitialized = this.isInitialized.bind(this);
    this.getUrl = this.getUrl.bind(this);

    this.endpoint = null;
    this.sessionId = null;
  }

  init(endpoint) {
    if (!endpoint) {
      throw new Error('Cms endpoint cannot be empty!');
    }

    this.endpoint = endpoint;
  }

  initSession(page) {
    const sessionId = _.get(page, 'pageContext.auth.session');

    if (!sessionId) {
      throw new Error('Cannot connect to cms: `session` is missing from `pageContext.auth`');
    }

    this.sessionId = sessionId;
  }

  isInitialized() {
    return !!this.endpoint;
  }

  getUrl(path = '', query, withSession) {
    const cmsUri = new Uri(path)
      .protocol(location.protocol)
      .host(this.endpoint);

    if (_.isEmpty(query) && !withSession) {
      return cmsUri.toString();
    }

    const cmsQuery = withSession
      ? { ...query, session_id: this.sessionId }
      : query;

    return cmsUri.query(cmsQuery).toString();
  }
}
