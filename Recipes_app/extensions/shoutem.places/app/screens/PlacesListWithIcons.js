import React from 'react';
import { connect } from 'react-redux';

import { connectStyle } from '@shoutem/theme';

import { currentLocation } from 'shoutem.cms';

import { ext } from '../const';
import { PlacesList, mapStateToProps, mapDispatchToProps } from './PlacesList';
import PlaceIconView from '../components/PlaceIconView';

class PlacesListWithIcons extends PlacesList {
  static propTypes = {
    ...PlacesList.propTypes,
  };

  renderRow(place) {
    return <PlaceIconView place={place} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('PlacesListWithIcons'))(currentLocation(PlacesListWithIcons)),
);
