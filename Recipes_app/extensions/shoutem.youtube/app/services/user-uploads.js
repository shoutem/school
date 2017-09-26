export const userRegex = /(?:http|https:\/\/|)www.youtube\.com\/user\/([a-zA-Z0-9]{1,})/i;

export function resolveUserPlaylistUrl(feedUrl, apiKey) {
  if (userRegex.test(feedUrl)) {
    const userId = feedUrl.match(userRegex)[1];
    const queryString = `part=snippet,contentDetails&forUsername=${userId}&key=${apiKey}`;
    return `https://www.googleapis.com/youtube/v3/channels?${queryString}`;
  }
  return null;
}
