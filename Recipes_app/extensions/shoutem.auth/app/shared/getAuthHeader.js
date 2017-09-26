import { ext } from '../const.js';

export function getAuthHeader(state) {
  const accessToken = state[ext()].access_token;
  return `Bearer ${accessToken}`;
}
