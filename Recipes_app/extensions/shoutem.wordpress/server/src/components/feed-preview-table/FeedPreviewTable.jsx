import _ from 'lodash';
import React, { PropTypes } from 'react';
import { isBusy } from '@shoutem/redux-io';
import './style.scss';

const renderImage = (item) => {
  const itemImage = _.get(item, 'featured_media_object.source_url');

  if (!itemImage) {
    return null;
  }

  const imageStyle = {
    backgroundImage: `url(${itemImage})`,
  };

  return (
    <div className="feed-preview-table-item__image-preview" style={imageStyle}></div>
  );
};

export default function FeedPreviewTable({ feedItems = [] }) {
  const loading = isBusy(feedItems);

  return (
    <table className="table feed-preview-table">
      <thead>
        <tr>
          <th className="feed-preview-table__image">Image</th>
          <th className="feed-preview-table__title">Title</th>
          <th className="feed-preview-table__date">Date</th>
        </tr>
      </thead>
      <tbody>
        {loading && (
          <tr>
            <td colSpan="3">loading content...</td>
          </tr>
        )}
        {!loading && (feedItems.length === 0) && (
          <tr>
            <td colSpan="3">No content to show</td>
          </tr>
        )}
        {(!loading) && feedItems.map(item => (
          <tr key={item.id} className="feed-preview-table-item">
            <td className="feed-preview-table-item__image">
              {renderImage(item)}
            </td>
            <td className="feed-preview-table-item__title">{item.title.rendered}</td>
            <td className="feed-preview-table-item__date">
              <span title={item.dateTimeFormatted}>{item.dateTimeDisplay}</span>
            </td>
          </tr>))}
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
