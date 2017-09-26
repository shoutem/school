import React, {
  Component,
} from 'react';

import { connect } from 'react-redux';

import _ from 'lodash';

import {
  ListView,
  Screen,
} from '@shoutem/ui';

import { EmptyStateView } from '@shoutem/ui-addons';
import { connectStyle } from '@shoutem/theme';

import {
  navigateTo,
  closeModal,
  openInModal,
} from '@shoutem/core/navigation';

import { ext, PAGE_SIZE } from '../const';
import ListItem from './ListItem';
import UpdateItemScreen from '../screens/UpdateItemScreen';

import {
  product as productShape,
  shop as shopShape,
} from './shapes';

import {
  cartItemAdded,
  refreshProducts,
} from '../redux/actionCreators';

import { getProducts } from '../redux/selectors';

const { arrayOf, bool, func, number, shape, string } = React.PropTypes;

/**
 * A component that displays a list of products, used in the main products screen and
 * search screen. Lets the user navigate to product details or add a product to cart.
 */
export class ProductsList extends Component {
  static propTypes = {
    // Action dispatched when a product is added to the cart
    cartItemAdded: func.isRequired,
    // Used to close modal after an item has been added to the cart
    closeModal: func,
    // Collection ID for which products are displayed
    collectionId: number,
    // Used to navigate to the product details screen after a product is selected
    navigateTo: func.isRequired,
    // Used to open the add to cart screen in modal
    openInModal: func,
    productsState: shape({
      // Used to display a loading status when fetching new products
      isLoading: bool,
      // Has fetching products failed with an error
      error: bool,
      // Products displayed in this list for its collection ID or tag
      products: arrayOf(productShape),
    }),
    // Called when reaching the end of the list to load more products or
    // to refresh them completely
    refreshProducts: func.isRequired,
    // Shop properties, currently used just to display currency
    shop: shopShape.isRequired,
    // Product tag for which products are displayed
    tag: string,
  };

  constructor(props) {
    super(props);

    this.onAddToCart = this.onAddToCart.bind(this);
    this.onLoadMore = this.onLoadMore.bind(this);
    this.refreshData = this.refreshData.bind(this);
    this.renderProductRow = this.renderProductRow.bind(this);

    this.state = { selectedItem: null };
  }

  componentDidMount() {
    const { error } = this.props.shop;

    if (error) {
      return;
    }

    this.refreshData();
  }

  onAddToCart(item) {
    const { openInModal } = this.props;

    const { add } = UpdateItemScreen.actionTypes;

    const route = {
      screen: ext('UpdateItemScreen'),
      props: {
        actionType: add,
        item,
        onActionButtonClicked: (type, { variant, quantity }) =>
          this.addItemToCart(item, variant, quantity),
      },
    };

    openInModal(route);
  }

  onLoadMore() {
    const { products } = this.props.productsState;

    if (_.size(products) < PAGE_SIZE) {
      return;
    }

    this.refreshData();
  }

  getNoProductsView() {
    return (
      <EmptyStateView
        icon="refresh"
        message="There are no products for this collection"
        retryButtonTitle="TRY AGAIN"
        onRetry={() => this.refreshData(true)}
      />
    );
  }

  getNoProductsForTagView() {
    const { tag } = this.props;

    const message = `There are no products for "${tag}".`;

    return (
      <EmptyStateView
        icon="search"
        message={message}
      />
    );
  }

  navigateToProductDetails(item) {
    const { navigateTo } = this.props;

    navigateTo({
      screen: ext('ProductDetailsScreen'),
      props: {
        productId: item.product_id,
      },
    });
  }

  // Called to load more products when the component is mounted or the list scrolled beyond
  // visible items
  refreshData(resetMode) {
    const { collectionId, refreshProducts, tag } = this.props;

    refreshProducts(collectionId, tag, resetMode);
  }

  addItemToCart(item, variant, quantity) {
    const { cartItemAdded, closeModal } = this.props;

    cartItemAdded({ item, variant, quantity });
    closeModal();
  }

  renderProductRow(item) {
    const { shop } = this.props;

    return (
      <ListItem
        item={item}
        onAddToCart={() => this.onAddToCart(item)}
        onPress={() => this.navigateToProductDetails(item)}
        shop={shop}
      />
    );
  }

  renderEmptyScreen() {
    const { tag } = this.props;

    return tag ? this.getNoProductsForTagView() : this.getNoProductsView();
  }

  renderProducts(products, isLoading) {
    return (
      <ListView
        data={products}
        loading={isLoading}
        onLoadMore={this.onLoadMore}
        onRefresh={() => this.refreshData(true)}
        renderRow={this.renderProductRow}
      />
    );
  }

  renderContent() {
    const { productsState, shop } = this.props;
    const { isLoading: productsLoading, products } = productsState;
    const { isLoading: shopLoading } = shop;


    const isLoading = productsLoading || shopLoading;

    return isLoading || _.size(products) ?
      this.renderProducts(products, isLoading)
      :
      this.renderEmptyScreen();
  }

  render() {
    const { error } = this.props.shop;

    if (error) {
      const message = 'There was an error while fetching the shop.\n';
      return <EmptyStateView message={message} />;
    }

    return (
      <Screen>
        { this.renderContent() }
      </Screen>
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const { shop } = state[ext()];
  const { collectionId, tag } = ownProps;

  const productsState = getProducts(state, collectionId, tag);

  return {
    collectionId,
    productsState,
    shop,
  };
};

export const mapDispatchToProps = {
  cartItemAdded,
  closeModal,
  navigateTo,
  openInModal,
  refreshProducts,
};

export default connect(mapStateToProps, mapDispatchToProps)(
    connectStyle(ext('ProductsList'))(ProductsList),
);
