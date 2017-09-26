import React from 'react';
import { connect } from 'react-redux';

import { connectStyle } from '@shoutem/theme';

import { ext } from '../const';

import {
  MenuListScreen,
  mapStateToProps,
  mapDispatchToProps,
} from './MenuListScreen';
import SmallListMenuView from '../components/SmallListMenuView';

class MenuSmallListScreen extends MenuListScreen {

  constructor(props, context) {
    super(props, context);
    this.renderRow = this.renderRow.bind(this);

    // This propery changes dropdown position
    this.state.renderCategoriesInline = false;
  }

  renderRow(item) {
    return (
      <SmallListMenuView
        item={item}
        onPress={this.openDetailsScreen}
        selectedCategoryId={this.props.selectedCategory.id}
      />
    );
  }
}

export default connectStyle(ext('MenuSmallListScreen'))(
  connect(mapStateToProps, mapDispatchToProps)(MenuSmallListScreen),
);
