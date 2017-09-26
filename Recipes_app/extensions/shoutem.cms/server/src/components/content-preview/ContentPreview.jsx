import React, { PropTypes } from 'react';
import _ from 'lodash';
import { Table } from 'react-bootstrap';
import { isBusy } from '@shoutem/redux-io';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { getCategoriesDisplayLabel } from '../../services';
import './style.scss';

function getCategoryName(resource) {
  const categories = _.filter(resource.categories, { autoCreated: false });
  const categoryNames = _.map(categories, 'name');

  return getCategoriesDisplayLabel(categoryNames);
}

export default function ContentPreview({ resources, titleProp, hasContent }) {
  return (
    <div className="content-preview">
      {hasContent && <span className="content-preview__overlay" />}
      <LoaderContainer
        isLoading={isBusy(resources)}
        isOverlay
      >
        <Table className="content-preview__table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
          {!hasContent &&
            <tr>
              <td colSpan="2">No content yet.</td>
            </tr>
          }
          {hasContent && resources.map(resource =>
            <tr key={resource.id}>
              <td>{resource[titleProp] || ''}</td>
              <td>{getCategoryName(resource)}</td>
            </tr>
          )}
          </tbody>
        </Table>
      </LoaderContainer>
    </div>
  );
}

ContentPreview.propTypes = {
  categories: PropTypes.array,
  resources: PropTypes.object.isRequired,
  titleProp: PropTypes.string.isRequired,
  hasContent: PropTypes.bool,
  inProgress: PropTypes.bool,
};
