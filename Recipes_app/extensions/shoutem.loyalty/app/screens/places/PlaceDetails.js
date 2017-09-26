import React, { Component } from 'react';

import { connect } from 'react-redux';

import _ from 'lodash';

import {
  Button,
  Caption,
  Divider,
  Html,
  ListView,
  Icon,
  Image,
  Row,
  Screen,
  ScrollView,
  Subtitle,
  Text,
  Tile,
  Title,
  TouchableOpacity,
  View,
} from '@shoutem/ui';

import {
  find,
  getCollection,
  isBusy,
} from '@shoutem/redux-io';

import {
  Linking,
  Platform,
} from 'react-native';

import {
  InlineMap,
 } from '@shoutem/ui-addons';

import {
  navigateTo,
  openInModal,
} from '@shoutem/core/navigation';

import {
  NavigationBar,
} from '@shoutem/ui/navigation';

import { connectStyle } from '@shoutem/theme';
import { openURL } from 'shoutem.web-view';
import {
  ext,
  PLACE_REWARDS_SCHEMA,
} from '../../const';

import {
  placeShape,
  rewardShape,
} from '../../components/shapes';

import PlaceRewardListView from '../../components/PlaceRewardListView';
import PlaceLoyaltyPointsView from '../../components/PlaceLoyaltyPointsView';

import {
  getCardStateForPlace,
 } from '../../redux';

/* eslint-disable class-methods-use-this */

const { arrayOf, func } = React.PropTypes;

export class PlaceDetails extends Component {
  static propTypes = {
    // The place
    place: placeShape.isRequired,
    // Rewards for this place
    rewards: arrayOf(rewardShape),
    /* Actions */
    find: func,
    // Opens the assign points flow in a modal dialog
    openInModal: func,
    openURL: func,
    navigateTo: func,
  };

  constructor(props) {
    super(props);

    this.collectPoints = this.collectPoints.bind(this);
    this.getNavBarProps = this.getNavBarProps.bind(this);
    this.navigateToPointsHistoryScreen = this.navigateToPointsHistoryScreen.bind(this);
    this.navigateToRewardDetailsScreen = this.navigateToRewardDetailsScreen.bind(this);
    this.openWebLink = this.openWebLink.bind(this);
    this.openMapLink = this.openMapLink.bind(this);
    this.openEmailLink = this.openEmailLink.bind(this);
    this.openPhoneLink = this.openPhoneLink.bind(this);
    this.openMapScreen = this.openMapScreen.bind(this);
    this.openURL = this.openURL.bind(this);

    this.renderRewardRow = this.renderRewardRow.bind(this);
  }

  componentWillMount() {
    const { find, place } = this.props;

    find(PLACE_REWARDS_SCHEMA, undefined, {
      'filter[place.id]': place.id,
    });
  }

  getNavBarProps() {
    const { place: { image, name = '' } } = this.props;

    return {
      styleName: image ? 'clear' : 'no-border',
      animationName: 'solidify',
      title: name.toUpperCase(),
    };
  }

  navigateToPointsHistoryScreen() {
    const { navigateTo, place } = this.props;

    navigateTo({
      screen: ext('PointsHistoryScreen'),
      props: {
        place,
      },
    });
  }

  navigateToRewardDetailsScreen(reward) {
    const { navigateTo, place } = this.props;
    const { placeRewardsParentCategoryId: parentCategoryId } = place;

    navigateTo({
      screen: ext('RewardDetailsScreen'),
      props: {
        reward: { ...reward, parentCategoryId, location: place.id },
        place,
      },
    });
  }

  collectPoints() {
    const { openInModal, place } = this.props;

    openInModal({
      screen: ext('VerificationScreen'),
      props: {
        place,
      },
    });
  }

  openURL() {
    const { place: { rsvpLink, name }, openURL } = this.props;
    openURL(rsvpLink, name);
  }

  openWebLink() {
    const { place: { url }, openURL } = this.props;
    openURL(url);
  }

  openMapLink() {
    const { location = {} } = this.props.place;
    const { latitude, longitude, formattedAddress } = location;

    const resolvedScheme = (Platform.OS === 'ios') ? `http://maps.apple.com/?ll=${latitude},${longitude}&q=${formattedAddress}` :
    `geo:${latitude},${longitude}?q=${formattedAddress}`;

    if (latitude && longitude) {
      Linking.openURL(resolvedScheme);
    }
  }

  openEmailLink() {
    const { place } = this.props;
    Linking.openURL(`mailto:${place.mail}`);
  }

  openPhoneLink() {
    const { place } = this.props;

    Linking.openURL(`tel:${place.phone}`);
  }

  openMapScreen() {
    const { navigateTo, place } = this.props;

    navigateTo({
      screen: ext('SinglePlaceMap'),
      props: {
        place,
        title: place.name,
      },
    });
  }

  renderLeadImage() {
    const { place: { image, location = {}, name } } = this.props;
    const { formattedAddress = '' } = location;

    return (
      <Image
        styleName="large"
        source={image && { uri: image.url }}
        animationName="hero"
      >
        <Tile>
          <Title>{name.toUpperCase()}</Title>
          <Caption styleName="sm-gutter-top">{formattedAddress}</Caption>
        </Tile>
      </Image>
    );
  }

  renderPoints() {
    const { place } = this.props;

    return (
      <PlaceLoyaltyPointsView
        onCollectPointsPress={this.collectPoints}
        onPointsHistoryPress={this.navigateToPointsHistoryScreen}
        place={place}
      />
    );
  }

  renderRewardRow(reward) {
    const { place } = this.props;

    return (
      <PlaceRewardListView
        key={reward.id}
        onPress={this.navigateToRewardDetailsScreen}
        place={place}
        reward={reward}
      />
    );
  }

  renderRewards() {
    const { rewards } = this.props;

    const data = isBusy(rewards) ? [] : [...rewards];

    return (
      <View>
        <Divider styleName="section-header">
          <Caption>REWARDS</Caption>
        </Divider>
        {!isBusy(rewards) && _.isEmpty(rewards) ?
          <Caption styleName="h-center md-gutter-top xl-gutter-horizontal">
            Currently, there are no rewards available for this store.
          </Caption>
          :
          <ListView
            data={data}
            loading={isBusy(rewards)}
            renderRow={this.renderRewardRow}
          />
        }
      </View>
    );
  }

  renderInlineMap() {
    const { place: { location = {}, name } } = this.props;

    const { latitude, longitude, formattedAddress } = location;

    if (!latitude || !longitude) {
      return null;
    }

    const marker = {
      longitude: parseFloat(longitude),
      latitude: parseFloat(latitude),
    };
    const region = {
      ...marker,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    return (
      <View styleName="solid">
        <TouchableOpacity
          onPress={this.openMapScreen}
        >
          <InlineMap
            initialRegion={region}
            markers={[marker]}
            selectedMarker={marker}
            styleName="medium-tall"
          >
            <View styleName="fill-parent overlay vertical v-center h-center">
              <Subtitle numberOfLines={1} >{name}</Subtitle>
              <Caption numberOfLines={2} >{formattedAddress}</Caption>
            </View>
          </InlineMap>
        </TouchableOpacity>
      </View>
    );
  }

  renderDescription() {
    const { place: { description } } = this.props;

    if (description) {
      return (
        <Tile>
          <Divider styleName="section-header">
            <Caption>LOCATION INFO</Caption>
          </Divider>
          <View styleName="md-gutter">
            <Html body={description} />
          </View>
          <Divider styleName="line" />
        </Tile>
      );
    }
    return null;
  }

  renderOpeningHours() {
    const { place: { openingHours } } = this.props;

    if (openingHours) {
      return (
        <Tile>
          <Divider styleName="section-header">
            <Caption>OPEN HOURS</Caption>
          </Divider>
          <Text styleName="md-gutter">{openingHours}</Text>
        </Tile>
      );
    }
    return null;
  }

  renderRsvpButton() {
    const { place: { rsvpLink } } = this.props;

    return rsvpLink ? (
      <Button onPress={this.openURL}>
        <Text>RESERVATION</Text>
      </Button>
    ) : null;
  }

  renderButtons() {
    return (
      <Row>
        <View styleName="horizontal h-center">
          {this.renderRsvpButton()}
        </View>
      </Row>
    );
  }

  renderDisclosureButton(title, subtitle, icon, onPressCallback) {
    if (!title) {
      return null;
    }
    return (
      <TouchableOpacity onPress={onPressCallback}>
        <Divider styleName="line" />
        <Row>
          <Icon styleName="indicator" name={icon} />
          <View styleName="vertical">
            <Subtitle>{subtitle}</Subtitle>
            <Text numberOfLines={1}>{title}</Text>
          </View>
          <Icon styleName="indicator disclosure" name="right-arrow" />
        </Row>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }

  render() {
    const { place } = this.props;
    const { location = {} } = place;
    return (
      <Screen styleName="full-screen paper">
        <NavigationBar {...this.getNavBarProps()} />
        <ScrollView>
          {this.renderLeadImage()}
          {this.renderPoints()}
          {this.renderRewards()}
          {this.renderOpeningHours()}
          {this.renderButtons()}
          {this.renderInlineMap()}
          {this.renderDescription(place)}
          {this.renderDisclosureButton(place.url, 'Visit webpage', 'web', this.openWebLink)}
          {this.renderDisclosureButton(location.formattedAddress, 'Directions', 'pin',
          this.openMapLink)}
          {this.renderDisclosureButton(place.mail, 'Email', 'email', this.openEmailLink)}
          {this.renderDisclosureButton(place.phone, 'Phone', 'call', this.openPhoneLink)}
        </ScrollView>
      </Screen>
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const { allPlaceRewards, allTransactions } = state[ext()];

  const { place } = ownProps;

  const cardState = getCardStateForPlace(state, place.id);
  const points = cardState ? cardState.points : 0;

  return {
    place: { ...place, points },
    rewards: getCollection(allPlaceRewards, state),
    transactions: getCollection(allTransactions, state),
  };
};

export const mapDispatchToProps = {
  find,
  navigateTo,
  openInModal,
  openURL,
};

export default connect(mapStateToProps, mapDispatchToProps)(
connectStyle(ext('PlaceDetails'))(PlaceDetails));
