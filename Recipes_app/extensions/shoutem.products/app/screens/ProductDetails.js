import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import {
  View,
  Screen,
  Subtitle,
  Image,
  Button,
  Icon,
  Text,
  Tile,
  Heading,
  ScrollView,
  Title,
  Caption,
  Divider,
  TouchableOpacity,
  Row,
  Html,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { NavigationBar } from '@shoutem/ui/navigation';

import { openURL as openURLAction } from 'shoutem.web-view';

import { ext } from '../const';

export class ProductDetails extends React.Component {
  static propTypes = {
    product: React.PropTypes.object.isRequired,
    openURL: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.onBuyPress = this.onBuyPress.bind(this);
    this.getNavBarProps = this.getNavBarProps.bind(this);
    this.renderProductPriceInfo = this.renderProductPriceInfo.bind(this);
    this.renderBuyField = this.renderBuyField.bind(this);
  }

  onBuyPress() {
    const { product, openURL } = this.props;
    openURL(product.link, product.name);
  }

  getNavBarProps() {
    const { product } = this.props;
    const share = {
      title: product.name,
      link: product.link,
    };

    return {
      styleName: 'clear',
      animationName: 'solidify',
      share,
      title: product.name,
    };
  }

  renderProductPriceInfo() {
    const { product } = this.props;
    const oldPrice = product.oldPrice;
    return (
      oldPrice ?
        <View virtual styleName="vertical h-center">
          <Subtitle styleName="line-through">
            {oldPrice}
          </Subtitle>
          <Heading styleName="sm-gutter-bottom">
            {product.currentPrice}
          </Heading>
        </View> : <Heading styleName="sm-gutter-bottom">{product.currentPrice}</Heading>
    );
  }

  renderBuyField() {
    const { product } = this.props;

    if (!product.link) {
      return null;
    }
    return (
      <Button styleName="md-gutter-top" onPress={this.onBuyPress}>
        <Text>{product.buyTitle}</Text>
      </Button>
    );
  }

  renderNoImage() {
    const { product } = this.props;

    if (product.image) {
      return (
        <Image
          animationName="hero"
          styleName="large-square placeholder"
          source={{ uri: _.get(product, 'image.url') }}
          key={product.name}
        >
          <Tile animationName="hero" styleName="text-centric fill-parent">
            <Title
              styleName="xl-gutter-top md-gutter-bottom lg-gutter-horizontal"
            >
              {product.name.toUpperCase()}
            </Title>
            {this.renderProductPriceInfo()}
            {this.renderBuyField()}
          </Tile>
        </Image>);
    }
    return (
      <Image
        animationName="hero"
        styleName="large-square placeholder"
      >
        <Tile animationName="hero" styleName="text-centric fill-parent">
          <Subtitle
            styleName="lg-gutter-top xl-gutter-bottom md-gutter-horizontal"
          >
            {product.name.toUpperCase()}
          </Subtitle>
          {this.renderProductPriceInfo()}
          {this.renderBuyField()}
        </Tile>
      </Image>
    );
  }

  renderInformation() {
    const { product } = this.props;

    if (!product.description) {
      return null;
    }
    return (
      <Tile>
        <Divider styleName="section-header">
          <Caption>INFORMATION</Caption>
        </Divider>
        <Html body={product.description} />
      </Tile>
    );
  }

  renderDisclosureBuyLink() {
    const { product } = this.props;

    if (!product.link) {
      return null;
    }
    return (
      <TouchableOpacity onPress={this.onBuyPress}>
        <Divider styleName="section-header">
          <Caption />
        </Divider>
        <Row>
          <Icon styleName="indicator" name="laptop" />
          <View styleName="vertical">
            <Subtitle>{product.buyTitle}</Subtitle>
            <Text numberOfLines={1}>{product.link}</Text>
          </View>
          <Icon styleName="indicator disclosure" name="right-arrow" />
        </Row>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <Screen styleName="full-screen paper">
        <NavigationBar {...this.getNavBarProps()} />
        <ScrollView>
          {this.renderNoImage()}
          {this.renderInformation()}
          {this.renderDisclosureBuyLink()}
          <Divider styleName="section-header" />
        </ScrollView>
      </Screen>
    );
  }
}

export default connect(undefined, { openURL: openURLAction })(
  connectStyle(ext('ProductDetails'))(ProductDetails),
);
