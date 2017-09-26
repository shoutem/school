import React, { PropTypes } from 'react';
import { FormGroup, ControlLabel } from 'react-bootstrap';
import { FontIcon } from '@shoutem/react-web-ui';
import FeedPreviewTable from '../feed-preview-table';
import './style.scss';

export default function FeedPreview({ feedUrl, onRemoveClick, feedItems }) {
  return (
    <div className="feed-preview">
      <form>
        <FormGroup className="feed-preview__container">
          <ControlLabel>YouTube source</ControlLabel>
          <div className="feed-preview__feed-url-container">
            <div className="feed-preview__play-img" />
            <div className="feed-preview__feed-url-text-wrapper text-ellipsis">
              <span className="feed-preview__feed-url">
                {feedUrl}
              </span>
            </div>
            <FontIcon
              className="feed-preview__remove"
              name="close"
              size="large"
              onClick={onRemoveClick}
            />
          </div>
        </FormGroup>
      </form>
      <FeedPreviewTable
        feedItems={feedItems}
      />
    </div>
  );
}

FeedPreview.propTypes = {
  feedUrl: PropTypes.string,
  feedItems: PropTypes.array,
  onRemoveClick: PropTypes.func,
};
