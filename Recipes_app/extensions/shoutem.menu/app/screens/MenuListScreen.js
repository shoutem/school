import React from 'react';
import { connect } from 'react-redux';

import { navigateTo } from '@shoutem/core/navigation';
import { connectStyle } from '@shoutem/theme';

import { CmsListScreen } from 'shoutem.cms';

import { ext } from '../const';
import ListMenuView from '../components/ListMenuView';

export class MenuListScreen extends CmsListScreen {
  static propTypes = {
    ...CmsListScreen.propTypes,
    navigateTo: React.PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.openDetailsScreen = this.openDetailsScreen.bind(this);
    this.renderRow = this.renderRow.bind(this);

    this.state = {
      ...this.state,
      schema: ext('Menu'),
    };
  }

  openDetailsScreen(item) {
    const { navigateTo } = this.props;
    const route = {
      screen: ext('MenuDetailsScreen'),
      props: {
        item,
      },
    };

    navigateTo(route);
  }

  renderRow(item) {
    return (
      <ListMenuView
        item={item}
        onPress={this.openDetailsScreen}
        selectedCategoryId={this.props.selectedCategory.id}
      />
    );
  }
}

export const mapStateToProps = CmsListScreen.createMapStateToProps(
  state => state[ext()].allMenuItems,
);

export const mapDispatchToProps = CmsListScreen.createMapDispatchToProps({
  navigateTo,
});

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('MenuListScreen'), {})(MenuListScreen),
);
