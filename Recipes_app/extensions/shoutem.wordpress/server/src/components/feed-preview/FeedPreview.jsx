import React, { PropTypes } from 'react';
import { FormGroup, ControlLabel } from 'react-bootstrap';
import URI from 'urijs';
import _ from 'lodash';
import { FontIcon } from '@shoutem/react-web-ui';
import FeedPreviewTable from '../feed-preview-table';
import './style.scss';

//eslint-disable-next-line max-len
const tutorialLink = 'https://pearsonnacommunity.force.com/support/s/article/ka6d00000019KVGAA2/How-to-display-mixed-content-with-Google-Chrome-Internet-Explorer-or-Firefox-1408394589290';

export default function FeedPreview({ feedUrl, onRemoveClick, feedItems }) {
  const feedUri = new URI(feedUrl);
  const feedProtocol = `${feedUri.protocol()}:`;
  const isUnsecure = (protocol) => protocol !== 'https';
  const showMixedContentWarning = isUnsecure(feedProtocol) && _.isEmpty(feedItems);

  return (
    <div className="feed-preview">
      <form>
        <FormGroup className="feed-preview__container">
          <ControlLabel>Wordpress page URL</ControlLabel>
          <div className="feed-preview__feed-url-container">
            <div />
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
      {showMixedContentWarning && (
        <ControlLabel>
          You are trying to load a feed from 'http'. Change feed's protocol to 'https' or
          <a href={tutorialLink} target="_top">
            learn how to allow your browser to load it.
          </a>
        </ControlLabel>
      )}
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
