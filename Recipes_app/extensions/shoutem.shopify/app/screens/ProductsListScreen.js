import React, {
  Component,
} from 'react';
import { connect } from 'react-redux';

import _ from 'lodash';

import {
  Button,
  DropDownMenu,
  Icon,
  Screen,
  View,
  Spinner,
} from '@shoutem/ui';

import { NavigationBar } from '@shoutem/ui/navigation';
import {
  getScreenState,
  navigateTo,
  setScreenState,
} from '@shoutem/core/navigation';

import { connectStyle } from '@shoutem/theme';

import { ext } from '../const';
import CartIcon from '../components/CartIcon';
import ProductsList from '../components/ProductsList';

import {
  collection as collectionShape,
  shop as shopShape,
} from '../components/shapes';

import { refreshProducts } from '../redux/actionCreators';
import { getCartSize } from '../redux/selectors';

const defaultCollection = { id: 0, title: 'All' };

const spinnerStyle = { marginTop: 20 };

const { func, number, shape, string } = React.PropTypes;

/**
 * This is a base screen that allows users to browse through products and collections
 */
export class ProductsListScreen extends Component {
  static propTypes = {
    // Number of items that the user has added to his cart
    cartSize: number.isRequired,
    // Selected collection
    collection: collectionShape,
    // Used to navigate to cart
    navigateTo: func.isRequired,
    // Dispatched when the user selects a collection to load products that belong
    // to that collection
    refreshProducts: func.isRequired,
    // ID of this screen, used to persist the selected collection
    screenId: string.isRequired,
    // Dispatched when a collection is selected to persist it for this screen
    setScreenState: func.isRequired,
    // Shop properties, currently used just to display currency
    shop: shopShape.isRequired,
    // Shortcut that opens this screen
    shortcut: shape({
      title: string,
    }),
  };

  constructor(props) {
    super(props);
    this.navigateToCart = this.navigateToCart.bind(this);
    this.navigateToSearchScreen = this.navigateToSearchScreen.bind(this);
    this.onCollectionSelected = this.onCollectionSelected.bind(this);

    this.state = {};
  }

  onCollectionSelected(collection) {
    const { collection: selectedCollection, refreshProducts,
      setScreenState, screenId } = this.props;

    if (selectedCollection.id === collection.id) {
      return;
    }

    setScreenState(screenId, {
      collectionId: collection.id,
    });

    refreshProducts(collection.id);
  }

  getNavBarProps() {
    const { cartSize, shortcut } = this.props;

    return {
      renderRightComponent: () => {
        return (
          <View virtual styleName="container">
            <Button
              onPress={this.navigateToSearchScreen}
              styleName="clear"
            >
              <Icon name="search" />
            </Button>
            <CartIcon
              cartSize={cartSize}
              onPress={this.navigateToCart}
            />
          </View>
        );
      },
      title: shortcut.title || 'SHOP',
    };
  }

  navigateToCart() {
    const { navigateTo } = this.props;

    navigateTo({
      screen: ext('CartScreen'),
    });
  }

  navigateToSearchScreen() {
    const { collection, navigateTo } = this.props;

    navigateTo({
      screen: ext('SearchProductsScreen'),
      props: {
        collectionId: collection.id,
      },
    });
  }

  renderCollectionsPicker(styleName = 'horizontal') {
    const { collection, shop } = this.props;
    const { collections } = shop;

    return (
      <DropDownMenu
        onOptionSelected={this.onCollectionSelected}
        options={collections}
        selectedOption={collection || collections[0]}
        titleProperty={'title'}
        valueProperty={'id'}
        styleName={styleName}
      />
    );
  }

  /* eslint-disable class-methods-use-this */
  renderProducts(collectionId) {
    return (
      <ProductsList collectionId={collectionId} />
    );
  }

  render() {
    const { collection = {}, shop } = this.props;
    const { collections, isLoading } = shop;

    return (
      <Screen>
        <NavigationBar {...this.getNavBarProps()} />
        {_.size(collections) > 1 ? this.renderCollectionsPicker() : null}
        { isLoading ? <Spinner style={spinnerStyle} /> : this.renderProducts(collection.id) }
      </Screen>
    );
  }
}

/**
 * Filters collections to show only those that are selected in shortcut settings.
 */
const getCollectionsVisibleInShortcut = (selectedCollections, allCollections) => {
  return _.filter(allCollections, collection =>
    !_.size(selectedCollections) || _.includes(selectedCollections, collection.id)
  );
};

export const mapStateToProps = (state, ownProps) => {
  const { shop } = state[ext()];
  const { screenId, shortcut = {} } = ownProps;
  const { selectedCollections } = shortcut.settings || {};

  const { collectionId } = getScreenState(state, screenId);

  const collections = getCollectionsVisibleInShortcut(selectedCollections, shop.collections);

  const hasCollectionFilter = _.size(selectedCollections) &&
    _.size(selectedCollections) !== _.size(shop.collections);

  if (_.size(collections) !== 1 && !hasCollectionFilter) {
    collections.unshift(defaultCollection);
  }

  return {
    cartSize: getCartSize(state),
    collection: _.find(collections, { 'id': collectionId }) || collections[0],
    shop: { ...shop, collections },
    shortcut,
  };
};

export const mapDispatchToProps = { navigateTo, refreshProducts, setScreenState };

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('ProductsListScreen'))(ProductsListScreen),
);
