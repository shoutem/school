import validator from 'validator';
import URI from 'urijs';

// channelId is going to be extracted if matches the regex function
const userRegex = /(?:http|https:\/\/|)www.youtube\.com\/user\/([a-zA-Z0-9_-]{1,})/i;
const channelRegex = /(?:http|https:\/\/|)www.youtube\.com\/channel\/([a-zA-Z0-9_-]{1,})/i;
const playlistRegex = /(?:http|https:\/\/|)www\.youtube\.com\/playlist\?list=([a-zA-Z0-9_-]{1,})/i;

export function isChannelUrl(feedUrl) {
  return channelRegex.test(feedUrl);
}

export function isUserUrl(feedUrl) {
  return userRegex.test(feedUrl);
}

export function isPlaylistUrl(feedUrl) {
  return playlistRegex.test(feedUrl);
}

function resolveApiEndpoint(type, params) {
  return new URI(`https://www.googleapis.com/youtube/v3/${type}`).query(params).toString();
}

export function resolveVideosSearchEndpoint(feedUrl, apiKey) {
  if (isChannelUrl(feedUrl)) {
    const channelId = feedUrl.match(channelRegex)[1];
    return resolveApiEndpoint('search', {
      part: 'id,snippet',
      maxResults: 20,
      key: apiKey,
      channelId,
    });
  } else if (isPlaylistUrl(feedUrl)) {
    const playlistId = feedUrl.match(playlistRegex)[1];
    return resolveApiEndpoint('playlistItems', {
      part: 'id,snippet',
      maxResults: 20,
      key: apiKey,
      playlistId,
    });
  }
  return null;
}


export function resolveUserChannel(feedUrl, apiKey) {
  if (isUserUrl(feedUrl)) {
    const userId = feedUrl.match(userRegex)[1];
    return resolveApiEndpoint('channels', {
      part: 'id,snippet,contentDetails',
      maxResults: 20,
      key: apiKey,
      forUsername: userId,
    });
  }
  return null;
}

export function resolveVideosFetchEndpoint(feedUrl, apiKey, videoIds) {
  const videoIdsStr = videoIds.join(',');
  if (isChannelUrl(feedUrl)) {
    const channelId = feedUrl.match(channelRegex)[1];
    return resolveApiEndpoint('videos', {
      part: 'id,snippet,contentDetails',
      maxResults: 20,
      key: apiKey,
      id: videoIdsStr,
      channelId,
    });
  } else if (isPlaylistUrl(feedUrl)) {
    const playlistId = feedUrl.match(playlistRegex)[1];
    return resolveApiEndpoint('videos', {
      part: 'id,snippet,contentDetails',
      maxResults: 20,
      key: apiKey,
      id: videoIdsStr,
      playlistId,
    });
  }
  return null;
}

export function createYoutubeValidationUrl(apiKey) {
  return resolveApiEndpoint('channels', {
    part: 'id,snippet',
    key: apiKey,
    id: 'UCK8sQmJBp8GCxrOtXWBpyEA',
  });
}

export function createYoutubePlaylistUrl(playlistId) {
  return `https://www.youtube.com/playlist?list=${playlistId}`;
}

const validateUrl = url => validator.isURL(url, { require_protocol: false });

export function validateYoutubeUrl(url) {
  if (!url || !validateUrl(url)) {
    return false;
  }

  if (isChannelUrl(url) || isUserUrl(url) || isPlaylistUrl(url)) {
    return true;
  }
  return false;
}
