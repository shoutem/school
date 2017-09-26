import _ from 'lodash';

export default function getImageSource(video) {
  return (
    _.get(video, 'snippet.thumbnails.medium.url') ||
    _.get(video, 'snippet.thumbnails.standard.url')
  );
}
