import _ from 'lodash';

/**
 * Get lead media post object. It is fetched through post.featured_media ID using
 * redux/loadPostsMedia function.
 * This function will transform wordpress media object into Shoutem's shoutem.rss lead image format.
 * @param {Object} post Wordpress post
 */
export default function getLeadImageUrl(post) {
  return _.get(post, 'featured_media_object.source_url');
}
