import React, {
  Component,
  PropTypes,
} from 'react';

import {
  FormGroup,
  ControlLabel,
} from 'react-bootstrap';

import { isBusy }  from '@shoutem/redux-io';

import { ext } from 'context';
import "../style.scss";

export default class ShopPreview extends Component {

  render() {
    const { store } = this.props;

    return (
      <div className="shop-preview">
        <form>
          <FormGroup>
            <ControlLabel>Loading from</ControlLabel>
            <div className="shop-preview__url-container">
              <div className="shop-preview__shop-img" />
              <div className="text-ellipsis">
                <span className="shop-preview__url">
                  {store}
                </span>
              </div>
            </div>
            <ControlLabel>Change this in global extension settings</ControlLabel>
          </FormGroup>
        </form>
      </div>
    );
  }
}

const { string } = PropTypes;

ShopPreview.propTypes = {
  store: string,
}
