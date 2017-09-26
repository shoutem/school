import _ from 'lodash';
import React, { PropTypes } from 'react';
import { isBusy } from '@shoutem/redux-io';
import FeedPreviewTableItem from './FeedPreviewTableItem';
import './style.scss';

export default function FeedPreviewTable({ feedItems }) {
  const loading = isBusy(feedItems);

  return (
    <table className="table feed-preview-table">
      <thead>
        <tr>
          <th className="feed-preview-table__title">Title</th>
          <th className="feed-preview-table__duration">
            <span className="feed-preview-table__duration-margin">Duration</span></th>
        </tr>
      </thead>
      <tbody>
        {loading && (
          <tr>
            <td colSpan="2">loading content...</td>
          </tr>
        )}
        {!loading && (_.isEmpty(feedItems)) && (
          <tr>
            <td colSpan="2">No content to show</td>
          </tr>
        )}
        {(!loading && !_.isEmpty(feedItems)) && feedItems.map(item => (
          <FeedPreviewTableItem item={item} key={item.id} />
        ))}
      </tbody>
    </table>
  );
}

FeedPreviewTable.propTypes = {
  feedItems: PropTypes.array,
};

FeedPreviewTable.defaultProps = {
  feedItems: [],
};
