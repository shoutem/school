import { StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { InteractionManager } from 'react-native';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import React, {
  PureComponent,
} from 'react';

import {
  EmptyStateView,
} from '@shoutem/ui-addons';

import {
  find,
  isBusy,
  isInitialized,
  isError,
  shouldRefresh,
  getCollection,
} from '@shoutem/redux-io';

import {
  Screen,
  Spinner,
  Title,
  Image,
  View,
  Divider,
  Caption,
  Subtitle,
  TouchableOpacity,
  ScrollView,
  Html,
} from '@shoutem/ui';

import {
  InlineMap,
} from '@shoutem/ui-addons';

import { NavigationBar } from '@shoutem/ui/navigation';
import { connectStyle } from '@shoutem/theme';
import { navigateTo } from '@shoutem/core/navigation';
import { openURL } from 'shoutem.web-view';
import SocialButton from '../components/SocialButton';
import { ext } from '../const';

export class AboutScreen extends PureComponent {
  static propTypes = {
    // The parent category that is used to display
    // the available categories in the drop down menu
    parentCategoryId: React.PropTypes.any,
    // Primary CMS data to display
    data: React.PropTypes.array.isRequired,
    // The shortcut title
    title: React.PropTypes.string.isRequired,
    // actions
    find: React.PropTypes.func.isRequired,
    navigateTo: React.PropTypes.func,
    openURL: React.PropTypes.func,
    // Settings
    navigationBarStyle: React.PropTypes.string.isRequired,
    imageSize: React.PropTypes.string.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.fetchData = this.fetchData.bind(this);

    this.state = {
      schema: ext('About'),
    };
  }

  componentWillMount() {
    const { data } = this.props;
    if (shouldRefresh(data)) {
      this.fetchData();
    }
  }

  isCollectionValid(collection) {
    if ((!isInitialized(collection) && !isError(collection)) || isBusy(collection)) {
      // If collection is not initialized but has error it means initialization failed.
      // The collection is loading, treat it as valid for now
      return true;
    }

    // The collection is considered valid if it is not empty
    return !_.isEmpty(collection);
  }

  shouldRenderPlaceholderView() {
    const { parentCategoryId, data } = this.props;
    return _.isUndefined(parentCategoryId) || !this.isCollectionValid(data);
  }

  fetchData(schema) {
    const { find, parentCategoryId } = this.props;
    const { schema: defaultSchema } = this.state;

    if (!parentCategoryId) {
      return;
    }

    InteractionManager.runAfterInteractions(() =>
      find(schema || defaultSchema, undefined, {
        'filter[categories]': parentCategoryId,
      }),
    );
  }

  isNavigationBarClear() {
    const { navigationBarStyle } = this.props;
    return navigationBarStyle === 'clear';
  }

  getNavBarProps() {
    const { data, title, parentCategoryId, navigationBarStyle } = this.props;

    if (!_.isUndefined(parentCategoryId) && (isBusy(data) || !isInitialized(data))) {
      // Do not show shortcut title in NavigationBar if still loading
      return {};
    }

    if (!data || _.isEmpty(data)) {
      // Show shortcut title if `EmptyStateView` is rendered (no collection or empty collection)
      return {
        title,
      };
    }

    const profile = _.first(data);
    const hasImage = !!profile.image;

    if (hasImage) {
      StatusBar.setBarStyle('light-content');
    }
    
    let styleName = '';
    let animationName = '';
    if (this.isNavigationBarClear()) {
      if (hasImage) {
        // If navigation bar is clear and image exists, navigation bar should be initially clear
        // with fade effect (to add shadow to image), but after scrolling down navigation bar
        // should appear (solidify animation)
        styleName = 'fade clear';
        animationName = 'solidify';
      } else {
        // If navigation bar is clear, but there is no image, navigation bar should be set to solid,
        // but boxing animation should be applied so that title and borders appear
        animationName = 'boxing';
      }
    }

    return {
      // If navigation bar is clear, show the name that is rendered below the image, so it looks like
      // it is transferred to the navigation bar when scrolling. Otherwise show the screen title
      // (from the shortcut). The screen title is always displayed on solid navigation bars.
      title: this.isNavigationBarClear() ?
        _.get(profile, 'name').toUpperCase() :
        _.get(this.props, 'shortcut.title', '').toUpperCase(),
      styleName,
      animationName,
      share: _.isUndefined(profile, 'web') ? null : {
        title: _.get(profile, 'name'),
        link: _.get(profile, 'web'),
      },
    };
  }

  renderPlaceholderView() {
    const { data, parentCategoryId } = this.props;
    let emptyStateViewProps;

    if (_.isUndefined(parentCategoryId)) {
      // If collection doesn't exist (`parentCategoryId` is undefined), notify user to create
      // content and reload app, because `parentCategoryId` is retrieved through app configuration
      emptyStateViewProps = {
        icon: 'error',
        message: 'Please create content and reload your app.',
      };
    } else {
      emptyStateViewProps = {
        icon: 'refresh',
        message: (isError(data)) ?
          'Unexpected error occurred.' : 'Nothing here at this moment.',
        onRetry: this.fetchData,
        retryButtonTitle: 'TRY AGAIN',
      };
    }

    return <EmptyStateView {...emptyStateViewProps} />;
  }

  renderLoadingSpinner() {
    return (
      <View styleName="xl-gutter-top">
        <Spinner styleName="lg-gutter-top" />
      </View>
    );
  }

  renderImage(profile, styleName) {
    const extraSpace = profile.image ? 'xl-gutter-top' : null;

    if (!_.get(profile, 'image')) {
      return (
        <View styleName={extraSpace}>
          <Divider />
        </View>
      );
    }

    return (
      <Image
        styleName={styleName || 'large'}
        source={{ uri: profile.image.url }}
        defaultSource={require('../assets/images/image-fallback.png')}
        animationName="hero"
      />
    );
  }

  renderTitle(profile) {
    if (!_.get(profile, 'name')) {
      return null;
    }

    const extraSpace = profile.image ? null : 'lg-gutter-bottom';

    return (
      <View styleName={extraSpace}>
        <Title styleName="xl-gutter-top xl-gutter-bottom h-center">
          {profile.name.toUpperCase()}
        </Title>
      </View>
    );
  }

  renderInfo(profile) {
    if (!_.get(profile, 'info')) {
      return null;
    }

    return (
      <View styleName="md-gutter-horizontal md-gutter-bottom">
        <Html body={profile.info} />
      </View>
      
    );
  }

  renderMap(profile) {
    const { navigateTo } = this.props;

    if (!_.get(profile, 'location.latitude') || !_.get(profile, 'location.longitude')) {
      return null;
    }

    const marker = {
      latitude: parseFloat(profile.location.latitude),
      longitude: parseFloat(profile.location.longitude),
      title: _.get(profile, 'location.formattedAddress'),
    };

    const initialRegion = {
      longitude: marker.longitude,
      latitude: marker.latitude,
      latitudeDelta: 0.03,
      longitudeDelta: 0.03,
    };

    const openMap = () => navigateTo({
      screen: ext('MapScreen'),
      props: { marker, title: profile.name },
    });

    return (
      <View>
        <Divider styleName="section-header">
          <Caption>LOCATION</Caption>
        </Divider>
        <TouchableOpacity onPress={openMap}>
          <InlineMap
            initialRegion={initialRegion}
            markers={[marker]}
            selectedMarker={marker}
            styleName="medium-tall"
          >
            <View styleName="overlay vertical v-center h-center fill-parent">
              <Subtitle>{profile.name}</Subtitle>
              <Caption>{_.get(profile, 'location.formattedAddress')}</Caption>
            </View>
          </InlineMap>
        </TouchableOpacity>
      </View>
    );
  }

  renderOpeningHours(profile) {
    if (!_.get(profile, 'hours')) {
      return null;
    }

    return (
      <View styleName="vertical">
        <Divider styleName="section-header">
          <Caption>OPENING HOURS</Caption>
        </Divider>
        <View styleName="md-gutter-horizontal md-gutter-top">
          <Html body={profile.hours} />
        </View>
        <Divider />
      </View>
    );
  }

  renderFooterButtons(profile) {
    const { openURL } = this.props;
    if (!profile) {
      return null;
    }

    return (
      <View styleName="horizontal h-center">
        <View styleName="horizontal h-start wrap">
          <SocialButton
            icon="web"
            url={profile.web}
            title="Web"
            openURL={openURL}
          />
          <SocialButton
            icon="call"
            url={profile.phone && `tel:${profile.phone}`}
            title="Phone"
          />
          <SocialButton
            icon="tweet"
            url={profile.twitter}
            title="Twitter"
            openURL={openURL}
          />
          <SocialButton
            icon="email"
            url={profile.mail && `mailto:${profile.mail}`}
            title="Email"
          />
          <SocialButton
            icon="linkedin"
            url={profile.linkedin}
            title="LinkedIn"
            openURL={openURL}
          />
          <SocialButton
            icon="facebook"
            url={profile.facebook}
            title="Facebook"
            openURL={openURL}
          />
        </View>
      </View>
    );
  }

  renderAboutInfo(profile) {
    const { imageSize } = this.props;

    return (
      <ScrollView>
        {this.renderImage(profile, imageSize)}
        <View styleName="solid">
          {this.renderTitle(profile)}
          {this.renderInfo(profile)}
          {this.renderMap(profile)}
          {this.renderOpeningHours(profile)}
          {this.renderFooterButtons(profile)}
          <Divider />
        </View>
      </ScrollView>
    );
  }

  renderData(data) {
    // If no data is available, render placeholder view
    if (this.shouldRenderPlaceholderView()) {
      return this.renderPlaceholderView();
    }

    // If data is still loading, render loading spinner
    if (isBusy(data) || !isInitialized(data)) {
      return this.renderLoadingSpinner();
    }

    // If valid data is retrieved, take first input only
    // And finally, proceed with rendering actual About content
    const profile = _.first(data);
    return this.renderAboutInfo(profile);
  }

  render() {
    const { data, navigationBarStyle } = this.props;
    const fullScreen = this.isNavigationBarClear() ? "full-screen" : "";

    return (
      <Screen styleName={`${fullScreen} paper`}>
        <NavigationBar {...this.getNavBarProps()} />
        {this.renderData(data)}
      </Screen>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const parentCategoryId = _.get(ownProps, 'shortcut.settings.parentCategory.id');
  const collection = state[ext()].allAbout;

  return {
    parentCategoryId,
    data: getCollection(collection[parentCategoryId], state),
  };
};

const mapDispatchToProps = { navigateTo, openURL, find };

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('About'))(AboutScreen)
);
