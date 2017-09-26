import React from 'react';
import { connect } from 'react-redux';
import { connectStyle } from '@shoutem/theme';
import { ext } from '../const';
import { FavoritesList, mapStateToProps } from '../screens/FavoritesList';
import PlaceIconView from '../components/PlaceIconView';

class FavoritesListWithIcons extends FavoritesList {
  static propTypes = {
    ...FavoritesList.propTypes,
  }

  renderFavorite(place) {
    return <PlaceIconView place={place} />;
  }
}

export default connect(mapStateToProps, undefined)(
  connectStyle(ext('FavoritesListWithIcons'))(FavoritesListWithIcons),
);
