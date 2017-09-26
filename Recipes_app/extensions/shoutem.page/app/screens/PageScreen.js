import React from 'react';

import { connect } from 'react-redux';
import _ from 'lodash';

import { connectStyle } from '@shoutem/theme';

import {
  Caption,
  Divider,
  ScrollView,
  Title,
  View,
} from '@shoutem/ui';

import {
  getCollection,
  find,
} from '@shoutem/redux-io';

import { components as aboutComponents } from 'shoutem.about';
import { executeShortcut } from 'shoutem.application';

import {
  IconGrid,
  List,
 } from 'shoutem.navigation';

import {
  ext,
  PAGE_SCHEMA,
} from '../const';

const { AboutScreen } = aboutComponents;

const navigationComponentsForLayoutTypes = {
  iconGrid: IconGrid,
  list: List,
};

const renderNameAndSubtitle = (profile) => {
  const { image, name = '', subtitle } = profile;

  const bottomGutter = image ? 'lg-gutter-bottom' : 'xl-gutter-bottom';

  return (
    <View styleName={`vertical xl-gutter-top ${bottomGutter} md-gutter-horizontal`}>
      <Title styleName="h-center md-gutter-bottom">{name.toUpperCase()}</Title>
      <Caption styleName="h-center">{subtitle}</Caption>
    </View>
  );
};

export class PageScreen extends AboutScreen {
  static propTypes = {
    ...AboutScreen.propTypes,
  };

  fetchData() {
    super.fetchData(PAGE_SCHEMA);
  }

  renderImage(profile, styleName) {
    const { imageSize } = this.props;
    return super.renderImage(profile, imageSize || 'large');
    
  }

  renderAboutInfo(profile) {
    const { executeShortcut, shortcut } = this.props;
    const { navigationLayoutType } = shortcut.settings;

    if (!profile) {
      return null;
    }

    const NavigationComponent = navigationComponentsForLayoutTypes[navigationLayoutType];
    const navigationSettings = this.props[navigationLayoutType];

    return (
      <ScrollView>
        {this.renderImage(profile)}
        <View styleName="solid">
          {renderNameAndSubtitle(profile)}
          {this.renderInfo(profile)}
          <Divider />
        </View>
        <NavigationComponent
          executeShortcut={executeShortcut}
          shortcut={shortcut}
          {...navigationSettings}
        />
      </ScrollView>
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const parentCategoryId = _.get(ownProps, 'shortcut.settings.parentCategory.id');
  const collection = state[ext()].allPage;

  return {
    parentCategoryId,
    data: getCollection(collection[parentCategoryId], state),
  };
};

export const mapDispatchToProps = { executeShortcut, find };

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('PageScreen'))(PageScreen)
);
