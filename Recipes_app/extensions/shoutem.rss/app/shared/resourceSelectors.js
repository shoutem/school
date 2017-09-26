import _ from 'lodash';

export function getLeadAttachment(resource, type) {
  return _.get(resource, `${type}Attachments[0]`);
}

/**
 * Returns the lead image URL from the provided RSS resource
 *
 * @param resource The RSS resource.
 * @returns {string} The image URL or undefined.
 */
export function getLeadImageUrl(resource) {
  return _.get(getLeadAttachment(resource, 'image'), 'src');
}

export function isLeadAttachment(resource, attachmentId, type) {
  const leadAttachment = getLeadAttachment(resource, type);
  return leadAttachment && leadAttachment.id === attachmentId;
}
