import _ from 'lodash';
import URI from 'urijs';

export function getActionCurrentPage(action) {
  const endpointUri = new URI(_.get(action, 'meta.endpoint'));
  return _.toNumber(endpointUri.query(true).page);
}

export function getActionPageSize(action) {
  const endpointUri = new URI(_.get(action, 'meta.endpoint'));
  return _.toNumber(endpointUri.query(true).per_page);
}

export function getResponseTotalPages(response) {
  const totalPages = parseInt(_.get(response, ['headers', 'x-wp-totalpages']), 10);
  return !isNaN(totalPages) ? totalPages : 1;
}

export function getResponseTotalResults(response) {
  const totalResults = parseInt(_.get(response, ['headers', 'x-wp-total']), 10);
  return !isNaN(totalResults) ? totalResults : 1;
}
