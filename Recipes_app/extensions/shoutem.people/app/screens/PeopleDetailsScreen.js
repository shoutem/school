import React from 'react';
import { Linking } from 'react-native';
import { connect } from 'react-redux';

import {
  Screen,
  Image,
  Title,
  Text,
  Caption,
  Button,
  Icon,
  View,
  Html,
  ScrollView,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { NavigationBar } from '@shoutem/ui/navigation';

import { openURL } from 'shoutem.web-view';

import { ext } from '../const';

class PeopleDetailsScreen extends React.Component {
  static propTypes = {
    person: React.PropTypes.object.isRequired,
    openURL: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.getNavBarProps = this.getNavBarProps.bind(this);
  }

  getNavBarProps() {
    const { person } = this.props;
    return {
      styleName: person.image ? 'clear' : 'no-border',
      animationName: person.image ? 'solidify' : 'boxing',
      title: `${person.firstName} ${person.lastName}`.toUpperCase(),
    };
  }

  getScreenStyle() {
    const { person } = this.props;
    return person.image ? 'full-screen paper' : 'paper';
  }

  renderImage() {
    const { person } = this.props;

    return person.image ? (
      <Image
        animationName="hero"
        styleName="large-square placeholder"
        source={{ uri: person.image && person.image.url }}
      />) : <View styleName="sm-gutter-top" />;
  }

  renderFooterButtons() {
    const { person } = this.props;

    return (
      <View styleName="horizontal h-center">
        <View styleName="horizontal wrap h-start">
          {this.renderLinkButton('web', 'Web', person.websiteUrl)}
          {this.renderLinkButton('call', 'Phone', person.phone ? `tel:${person.phone}` : null)}
          {this.renderLinkButton('tweet', 'Twitter', person.twitterPageUrl)}
          {this.renderLinkButton('linkedin', 'LinkedIn', person.linkedinProfileUrl)}
          {this.renderLinkButton('facebook', 'Facebook', person.facebookProfileUrl)}
          {this.renderLinkButton('email', 'Email',
          person.email ? `mailto:${person.email}` : null)}
        </View>
      </View>
    );
  }

  renderLinkButton(icon, name, url) {
    if (!url) return null;  // field is empty

    const { openURL, person } = this.props;
    const fullName = `${person.firstName} ${person.lastName}`;

    if (/phone|email/i.test(name)) {
      return (
        <Button styleName="stacked clear tight" onPress={() => Linking.openURL(url)}>
          <Icon name={icon} />
          <Text>{name}</Text>
        </Button>
      );
    }

    return (
      <Button styleName="stacked clear tight" onPress={() => openURL(url, fullName)}>
        <Icon name={icon} />
        <Text>{name}</Text>
      </Button>
    );
  }

  render() {
    const { person } = this.props;
    const fullName = `${person.firstName} ${person.lastName}`.toUpperCase();
    const screenStyle = this.getScreenStyle();

    return (
      <Screen styleName={screenStyle}>
        <NavigationBar {...this.getNavBarProps()} />
        <ScrollView>
          {this.renderImage()}

          <View styleName="solid">
            <View styleName="vertical xl-gutter-top lg-gutter-bottom md-gutter-horizontal">
              <Title styleName="h-center md-gutter-bottom">{fullName}</Title>
              <Caption styleName="h-center">{person.profession}</Caption>
            </View>

            <Html body={person.biography} />
          </View>

          {this.renderFooterButtons()}
        </ScrollView>
      </Screen>
    );
  }
}

export default connect(undefined, { openURL })(
    connectStyle(ext('PeopleDetailsScreen'))(PeopleDetailsScreen),
  );
