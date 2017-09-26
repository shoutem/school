import pack from './package.json';

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

export const API_ENDPOINT = '{feedUrl}/wp-json/wp/v2/posts?page={page}&per_page={per_page}';
export const MEDIA_API_ENDPOINT =
  '{feedUrl}/wp-json/wp/v2/media?per_page={per_page}';
export const WORDPRESS_NEWS_SCHEMA = 'shoutem.wordpress.news';
export const WORDPRESS_MEDIA_SCHEMA = 'shoutem.wordpress.media';

export function getFeedUrl(feedUrl) {
  return `${feedUrl}/wp-json/wp/v2/posts?page={page}&per_page={per_page}`;
}

export function getPostsMediaUrl(feedUrl) {
  return `${feedUrl}/wp-json/wp/v2/media?per_page={per_page}`;
}
