import React from 'react';
import { connect } from 'react-redux';
import * as _ from 'lodash';
import {
  Screen,
  Image,
  Divider,
  Caption,
  Title,
  Tile,
  Html,
  ScrollView,
  View,
  ShareButton,
} from '@shoutem/ui';
import { NavigationBar } from '@shoutem/ui/navigation';

import { openURL } from 'shoutem.web-view';
import { Favorite } from 'shoutem.favorites';

import { formatBookCaption } from '../shared/formatBookCaption';
import { LinkButton } from '../components/LinkButton';

/* eslint-disable react/prefer-stateless-function */
class BooksDetailsScreen extends React.Component {
  static propTypes = {
    book: React.PropTypes.any,
    openURL: React.PropTypes.func,
    hasFavoriteButton: React.PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.renderFavoriteButton = this.renderFavoriteButton.bind(this);
  }

  getNavBarProps() {
    const { book, hasFavoriteButton } = this.props;
    const favorites = hasFavoriteButton ?
      (<Favorite
        virtual
        item={book}
        schema={book.type}
        buttonStyle={book.buyUrl ? null : 'md-gutter-right'}
      />) : null;
    const share = book.buyUrl ?
    (<ShareButton
      url={book.buyUrl}
      title={book.title}
    />
) : null;

    return {
      renderRightComponent: () => (
        <View virtual styleName="container">
          {favorites}
          {share}
        </View>
      ),
      animationName: 'solidify',
      title: book.title,
      styleName: 'clear',
    };
  }

  renderFavoriteButton() {
    const { hasFavoriteButton, book } = this.props;

    if (hasFavoriteButton) {
      return (
        <Favorite item={book} />
      );
    }

    return null;
  }

  render() {
    const { book, openURL } = this.props;

    return (
      <Screen styleName="full-screen paper">
        <NavigationBar {...this.getNavBarProps()} />
        <ScrollView>
          <Image
            styleName="large-square placeholder"
            animationName="hero"
            source={{ uri: _.get(book, 'image.url') }}
          >
            <Tile
              animationName="hero"
            >
              <Title styleName="md-gutter-bottom">
                {book.title.toUpperCase()}
              </Title>
              <Caption styleName="md-gutter-bottom">{formatBookCaption(book)}</Caption>
              <LinkButton book={book} onPress={openURL} />
            </Tile>
          </Image>

          <Divider styleName="line" />

          <View styleName="solid">
            <Html body={book.description} />
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export default connect(
  undefined,
  { openURL },
)(BooksDetailsScreen);
