import LoyaltyApi from './loyaltyApi';
const loyaltyApi = new LoyaltyApi();
const getLoyaltyUrl = loyaltyApi.getUrl;

import {
  getErrorCode,
} from './errors';

export {
  loyaltyApi,
  getLoyaltyUrl,
  getErrorCode,
};
