import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { connectStyle } from '@shoutem/theme';

import {
  GridRow,
} from '@shoutem/ui';

import {
  ProductsList,
  mapStateToProps,
  mapDispatchToProps,
} from './ProductsList';

import GridItem from '../components/GridItem';
import FeaturedItem from '../components/FeaturedItem';

import { ext } from '../const';

/**
 * A component that displays products in a grid, with the first one featured.
 */
class ProductsGrid extends ProductsList {
  static propTypes = {
    ...ProductsList.propTypes,
  };

  renderProductRow(products, sectionId, index) {
    if (index === '0') {
      return this.renderFeaturedProduct(products[0]);
    }

    const gridProducts = _.map(products, product => this.renderGridProduct(product));

    return (
      <GridRow columns={2}>
        {gridProducts}
      </GridRow>
    );
  }

  renderGridProduct(item) {
    const { shop } = this.props;

    return (
      <GridItem
        item={item}
        key={item.product_id}
        onAddToCart={() => this.onAddToCart(item)}
        onPress={() => this.navigateToProductDetails(item)}
        shop={shop}
      />
    );
  }

  renderFeaturedProduct(item) {
    const { shop } = this.props;

    return (
      <FeaturedItem
        item={item}
        onAddToCart={() => this.onAddToCart(item)}
        onPress={() => this.navigateToProductDetails(item)}
        shop={shop}
      />
    );
  }

  renderProducts(products, isLoading) {
    // Group the products into rows with 2 columns, except for the
    // first one, which is treated as a featured product
    let isFirstProduct = true;
    const groupedProducts = GridRow.groupByRows(products, 2, () => {
      if (isFirstProduct) {
        isFirstProduct = false;
        return 2;
      }

      return 1;
    });

    return super.renderProducts(groupedProducts, isLoading);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('ProductsGrid'), {})(ProductsGrid),
);
