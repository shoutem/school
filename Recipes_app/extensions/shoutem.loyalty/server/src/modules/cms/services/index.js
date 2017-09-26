import rsaaPromise from './rsaaPromise';
import CmsApi from './cmsApi';
const cmsApi = new CmsApi();
const getCmsUrl = cmsApi.getUrl;

export {
  rsaaPromise,
  cmsApi,
  getCmsUrl,
};
