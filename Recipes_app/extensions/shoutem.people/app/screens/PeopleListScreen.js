import React from 'react';
import { connect } from 'react-redux';

import { navigateTo } from '@shoutem/core/navigation';
import { connectStyle } from '@shoutem/theme';

import { CmsListScreen } from 'shoutem.cms';

import { ext } from '../const';
import ListPeopleView from '../components/ListPeopleView';

export class PeopleListScreen extends CmsListScreen {
  static propTypes = {
    ...CmsListScreen.propTypes,
    navigateTo: React.PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.renderRow = this.renderRow.bind(this);
    this.openDetailsScreen = this.openDetailsScreen.bind(this);

    this.state = {
      ...this.state,
      schema: ext('People'),
    };
  }

  openDetailsScreen(person) {
    const { navigateTo } = this.props;
    navigateTo({
      screen: ext('PeopleDetailsScreen'),
      props: {
        person,
      },
    });
  }

  renderRow(person) {
    return (
      <ListPeopleView
        person={person}
        onPress={this.openDetailsScreen}
        selectedCategoryId={this.props.selectedCategory.id}
      />
    );
  }
}

export const mapStateToProps = CmsListScreen.createMapStateToProps(
  state => state[ext()].allPeople,
);

export const mapDispatchToProps = CmsListScreen.createMapDispatchToProps({
  navigateTo,
});

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('PeopleListScreen'), {})(PeopleListScreen),
);
