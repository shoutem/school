import React from 'react';

import {
  Image,
  ScrollView,
  View,
} from '@shoutem/ui';

import {
  Scaler,
} from '../helpers';

const defaultResolution = {
  width: 375,
  height: 667,
};

/**
 * Folder base component implements folder components shared methods.
 * Provides render lifecycle which can be overridden for custom layout.
 *  1. render
 *  2. renderContentContainer
 *  3. renderScrollView
 *    1. groupChildrenIntoPages - group shortcuts and pass to next step,
 *                                override this method for custom grouping
 *  4. renderPages
 *  5. renderPage
 *  6. renderRows
 *  7. renderRow
 *  8. renderItems
 *  9. renderItem
 *  Folder data structure
 *   Pages - array of page
 *    Page - array of rows
 *     Row - array of items
 *      Item - shortcut object
 *  Render methods use following style to style rendered component
 *   pageStyle
 *   rowStyle
 *   itemStyle - nested {item, icon, text} style
 * Implement "resolveScreenStyles" at child class to provide previously mentioned styles.
 * Required props
 *  executeShortcut {redux action}
 */
export default class FolderBase extends React.Component {
  static propTypes = {
    isRootScreen: React.PropTypes.bool,
    shortcut: React.PropTypes.object.isRequired,
    style: React.PropTypes.object,
    executeShortcut: React.PropTypes.func,
    showText: React.PropTypes.bool,
    iconSize: React.PropTypes.string,
  };

  static mapPropsToStyleNames = (styleNames, props) => {
    const { showIcon, showText, iconSize, isRootScreen } = props;

    styleNames.push(`${iconSize}-icon`);

    if (!showText) {
      styleNames.push('text-hidden');
    }

    if (!showIcon) {
      styleNames.push('icon-hidden');
    }

    if (isRootScreen) {
      styleNames.push('main-navigation');
    }

    return styleNames;
  };

  constructor(props, context) {
    super(props, context);

    this.itemPressed = this.itemPressed.bind(this);
    this.layoutChanged = this.layoutChanged.bind(this);
    this.renderPage = this.renderPage.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderItem = this.renderItem.bind(this);

    this.state = {
      dimensions: {
        width: null,
        height: null,
      },
    };

    this.scaler = new Scaler();
    // Android: lineHeight must be an integer, so we're rounding possible float value to integer.
    // https://github.com/facebook/react-native/issues/7877
    this.scaler.addPropTransformer('lineHeight', oldValue => Math.round(oldValue));
  }

  /**
   * Get screen layout settings from props.
   * By default provides layout settings from this.props but it accepts custom props.
   * @param props (optional) Used for nextProps
   * @returns {*}
   */
  getLayoutSettings(props = this.props) {
    return props;
  }

  /**
   * @param width Page width
   * @param height Page height
   */
  updateDimensions(width, height, callback) {
    this.setState({
      dimensions: {
        width,
        height,
      },
    }, callback);
  }

   /**
   * Save new page width and height so it can be reused
   * Refresh dimension related state after updating page dimensions.
   * @param width Layout width
   * @param height Layout height
   */
  layoutChanged({ nativeEvent: { layout: { width, height } } }) {
    this.scaler.resolveRatioByWidth({ width, height }, defaultResolution);
    this.updateDimensions(width, height);
  }

  /**
   * Scale value to fit referent resolution.
   * @param value {int}
   * @returns {floor}
   */
  scale(value) {
    return this.scaler.scale(value);
  }

  /**
   * Open a shortcut screen.
   * @param shortcut
   */
  itemPressed(shortcut) {
    this.props.executeShortcut(shortcut.id);
  }

  /**
   * Default grouping, it behaves like only one page is to be rendered.
   * @param children
   * @returns {*}
   */
  groupChildrenIntoPages(children) {
    // By default group all rows into one page
    return [children];
  }

  resolveRowProps() {
    return {};
  }

  resolvePageProps() {
    return {};
  }

  resolveScrollViewProps() {
    return {
      style: this.props.style.scrollView,
    };
  }

  // eslint-disable-next-line no-unused-vars
  renderItem(shortcut, index) {}

  /**
   * Iterate trough row items.
   * @param page
   * @returns {Array}
   */
  renderItems(row) {
    return row.map(this.renderItem);
  }

  /**
   * Render row and its items
   * @param row - array of items
   * @returns {Array}
   */
  renderRow(row, index) {
    return (
      <View key={`row_${index}`} {...this.resolveRowProps()}>
        {this.renderItems(row)}
      </View>
    );
  }

  /**
   * Iterate trough page rows.
   * @param page
   * @returns {Array}
   */
  renderRows(page = []) {
    return page.map(this.renderRow);
  }

  /**
   * Render page and it rows.
   * @param page - array of rows.
   * @param index
   * @returns {XML}
   */
  renderPage(page, index = 1) {
    return (
      <View key={`page_${index}`} {...this.resolvePageProps()}>
        {this.renderRows(page)}
      </View>
    );
  }

  /**
   * Iterate trough pages.
   * @param pages - is array of page.
   * @returns {Array}
   */
  renderPages(pages = []) {
    return pages.map(this.renderPage);
  }

  renderScrollView() {
    return (
      <ScrollView {...this.resolveScrollViewProps()}>
        {this.renderPages(this.groupChildrenIntoPages(this.props.shortcut.children))}
      </ScrollView>
    );
  }

  renderContentContainer() {
    const { dimensions: { width, height } } = this.state;

    if (width === null || height === null) {
      return null;
    }

    const { backgroundImage } = this.getLayoutSettings();
    if (backgroundImage) {
      return (
        <View style={this.props.style.backgroundWrapper}>
          <Image styleName="fill-parent" source={{ uri: backgroundImage }} />
          {this.renderScrollView()}
        </View>
      );
    }
    return this.renderScrollView();
  }

  render() {
    return (
      <View onLayout={this.layoutChanged} styleName="flexible">
        {this.renderContentContainer()}
      </View>
    );
  }
}
