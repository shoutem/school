import { denormalizeCollection } from 'denormalizer';
import { cloneStatus }  from '@shoutem/redux-io';
import moment from 'moment';
import _ from 'lodash';

const RSS_DATE_TIME_FORMAT = 'lll';
moment.locale('en');

function toLocalDateTime(dateTime) {
  const MAX_DIFFERENCE_IN_HOURS = 12;
  const date = new Date(dateTime);

  if (date.toString() === 'Invalid Date') {
    return {
      dateTimeFormatted: ' - ',
      dateTimeDisplay: ' - ',
    };
  }

  const originalDate = moment(date);
  const nowDate = moment(new Date());
  const differenceInHours = nowDate.diff(originalDate, 'hours');
  const dateTimeFormatted = originalDate.format(RSS_DATE_TIME_FORMAT);
  const displayTimeAgo = differenceInHours <= MAX_DIFFERENCE_IN_HOURS;
  const dateTimeDisplay = displayTimeAgo ? originalDate.from(nowDate) : dateTimeFormatted;

  return {
    dateTimeFormatted,
    dateTimeDisplay,
  };
}

function createFeedItemInfo(feedItem) {
  const dateTime = toLocalDateTime(feedItem.timeCreated);
  const { dateTimeDisplay, dateTimeFormatted } = dateTime;
  const feedItemInfo = {
    ...feedItem,
    dateTimeFormatted,
    dateTimeDisplay,
  };
  cloneStatus(feedItem, feedItemInfo);
  return feedItemInfo;
}

export function getFeedItems(extensionState) {
  const feedItems = denormalizeCollection(extensionState.VimeoPage.feedItems);
  const feedItemInfos = _.map(feedItems, item => createFeedItemInfo(item));
  cloneStatus(feedItems, feedItemInfos);
  return feedItemInfos;
}
