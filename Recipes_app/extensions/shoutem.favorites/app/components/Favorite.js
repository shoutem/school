import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LayoutAnimation } from 'react-native';
import { bindActionCreators } from 'redux';
import {
  Button,
  Icon,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import {
  saveFavorite,
  deleteFavorite,
  isFavoriteItem,
  isFavoritesSchema,
} from 'shoutem.favorites';

import { ext } from '../const';

export class Favorite extends Component {
  static propTypes = {
    item: React.PropTypes.any.isRequired,
    saveFavorite: React.PropTypes.func,
    deleteFavorite: React.PropTypes.func,
    isFavorite: React.PropTypes.bool,
    navBarButton: React.PropTypes.bool,
    schema: React.PropTypes.string.isRequired,
    children: React.PropTypes.any,
    hasFavorites: React.PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.toggleFavorite = this.toggleFavorite.bind(this);
  }

  toggleFavorite() {
    const { item, saveFavorite, isFavorite, deleteFavorite, schema } = this.props;

    if (isFavorite) {
      LayoutAnimation.easeInEaseOut();
      deleteFavorite(item.id, schema);
    } else {
      LayoutAnimation.easeInEaseOut();
      saveFavorite({ id: item.id, timestamp: Date.now() }, schema);
    }
  }

  render() {
    const { navBarButton, isFavorite, hasFavorites } = this.props;

    const type = isFavorite ? 'add-to-favorites-on' : 'add-to-favorites-off';
    const styleName = navBarButton ? 'clear' : 'clear tight';

    if (!hasFavorites) {
      return null;
    }

    return (
      <Button
        styleName={styleName}
        onPress={this.toggleFavorite}
      >
        {this.props.children || <Icon name={type} />}
      </Button>
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const { schema, item } = ownProps;
  return {
    isFavorite: isFavoriteItem(state, schema, item.id),
    hasFavorites: isFavoritesSchema(state, schema),
  };
};

export const mapDispatchToProps = dispatch => (
  bindActionCreators(
    {
      saveFavorite,
      deleteFavorite,
    },
    dispatch,
  )
);

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('Favorite'), undefined, undefined, { virtual: true })(Favorite)
);
