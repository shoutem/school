import React from 'react';
import { connect } from 'react-redux';

import { navigateTo as navigateToAction } from '@shoutem/core/navigation';
import { connectStyle } from '@shoutem/theme';
import { openURL as openURLAction } from 'shoutem.web-view';

import { CmsListScreen } from 'shoutem.cms';
import { ext } from '../const';
import ListProductView from '../components/ListProductView';

export class ProductsList extends CmsListScreen {
  static propTypes = {
    ...CmsListScreen.propTypes,
    navigateTo: React.PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
    this.renderRow = this.renderRow.bind(this);
    this.openDetailsScreen = this.openDetailsScreen.bind(this);

    this.state = {
      ...this.state,
      schema: ext('Products'),
    };
  }

  openDetailsScreen(product) {
    const { navigateTo } = this.props;

    navigateTo({
      screen: ext('ProductDetails'),
      props: { product },
    });
  }

  renderRow(product) {
    return (
      <ListProductView
        product={product}
        onPress={this.openDetailsScreen}
      />
    );
  }
}

export const mapStateToProps = CmsListScreen.createMapStateToProps(
  state => state[ext()].latestProducts,
);

export const mapDispatchToProps = CmsListScreen.createMapDispatchToProps({
  navigateTo: navigateToAction,
  openURL: openURLAction,
});

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('ProductsList'), {})(ProductsList),
);
