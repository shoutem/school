import React from 'react';
import _ from 'lodash';
import { connectStyle } from '@shoutem/theme';

import {
  GridRow,
  HorizontalPager,
  PageIndicators,
} from '@shoutem/ui';

import { ICON_GRID } from '../const';
import IconGridCellItem from './IconGridCellItem';
import FolderBase from './FolderBase';

const renderPageIndicators = (data, selectedIndex) => (
  <PageIndicators
    activeIndex={selectedIndex}
    count={_.size(data)}
    styleName="overlay-bottom"
  />
);

export class IconGrid extends FolderBase {
  static propTypes = {
    ...FolderBase.propTypes,
    rows: React.PropTypes.number.isRequired,
    cols: React.PropTypes.number.isRequired,
    // TODO (Braco) - update props
    scrolling: React.PropTypes.string,
    gridAlignment: React.PropTypes.string,
    iconWidth: React.PropTypes.number,
    iconHeight: React.PropTypes.number,
    showIcon: React.PropTypes.bool,
    showText: React.PropTypes.bool,
    scrollingDirection: React.PropTypes.string,
    backgroundImage: React.PropTypes.string,
    resolution: React.PropTypes.shape({
      // TODO(Braco) - document it, spread word to builder people
      width: React.PropTypes.number,
      height: React.PropTypes.number,
    }),
  };

  constructor(props) {
    super(props);
    this.onPageSelected = this.onPageSelected.bind(this);

    this.state = { ...this.state, selectedIndex: 0 };
  }

  isPagingEnabled(props) {
    return this.getLayoutSettings(props).scrolling === 'paged';
  }

  hasPager() {
    return this.isPagingEnabled() && this.getPageCount() > 1;
  }

  getPageCount() {
    const { cols, rows } = this.getLayoutSettings();
    const { children } = this.props.shortcut;

    return Math.ceil(_.size(children) / (cols * rows));
  }

  calculateRowWidth(props = this.props) {
    const { cols } = this.getLayoutSettings(props);
    const { item, row } = this.props.style;
    const itemWidth = _.get(item, 'width', 0);
    const itemMargin = _.get(item, 'marginLeft', 0);
    const rowRightPadding = _.get(row, 'paddingRight', 0);
    // Actual row width.
    // Used to keep items aligned from corner to corner in the row.
    // Prevents last item in last row if row is not filled from centering.
    return ((itemWidth + itemMargin) * cols) + rowRightPadding;
  }

  resolveRowStyleName(props = this.props) {
    const { gridAlignment } = this.getLayoutSettings(props);
    // Strip horizontal alignment from grid alignment
    const horizontalAlignment = gridAlignment.replace(/top|middle|bottom/, '').toLowerCase();
    return `${horizontalAlignment}-alignment`;
  }

  resolveRowProps() {
    const { row } = this.props.style;
    return {
      style: this.scale({
        width: this.calculateRowWidth(),
        ...row,
      }),
      styleName: this.resolveRowStyleName(),
    };
  }

  /**
   * Resolve dynamic part of Icon Grid styles.
   * Merge Icon Grid styles from theme with dynamically resolved style.
   * @param props
   * @returns {{pageStyle: {}, rowStyle: {}, cellStyle: {icon: {}, item: {}}}}
   */
  resolvePageProps() {
    const { style } = this.props;
    const { dimensions: { width, height } } = this.state;

    const { gridAlignment } = this.getLayoutSettings();

    const styleNames = [gridAlignment];

    if (this.hasPager()) {
      styleNames.push('lg-gutter-vertical');
    }

    return {
      style: {
        width,
        height: this.isPagingEnabled() ? height : null,
        ...this.scale(style.page),
      },
      styleName: styleNames.join(' '),
    };
  }

  resolveScrollViewProps() {
    const { scrollingDirection } = this.getLayoutSettings();
    return {
      ...super.resolveScrollViewProps(),
      horizontal: scrollingDirection === 'horizontal',
      pagingEnabled: this.isPagingEnabled(),
    };
  }

  onPageSelected(newPageIndex) {
    this.setState({ selectedIndex: newPageIndex });
  }

  groupItemsIntoRows(items) {
    const { cols } = this.getLayoutSettings();
    return GridRow.groupByRows(items, cols);
  }

  groupRowsIntoPages(rows) {
    const { rows: rowsPerPage } = this.getLayoutSettings();
    return rows.reduce((pages, row) => {
      let currentPage = _.last(pages);

      if (!currentPage || _.size(currentPage) === rowsPerPage) {
        currentPage = [];
        pages.push(currentPage);
      }

      currentPage.push(row);
      return pages;
    }, []);
  }

  groupChildrenIntoPages(children) {
    const rows = this.groupItemsIntoRows(children);

    if (this.isPagingEnabled()) {
      return this.groupRowsIntoPages(rows);
    }

    // Only one page if infinite scrolling
    return [rows];
  }

  renderItem(shortcut, index) {
    const { showText } = this.getLayoutSettings();
    const { style } = this.props;
    const cellStyle = {
      text: this.scale(style.text),
      icon: this.scale(style.icon),
      iconContainer: this.scale(style.iconContainer),
      item: this.scale(style.item),
    };
    return (
      <IconGridCellItem
        key={`item_${index}`}
        showText={showText}
        shortcut={shortcut}
        style={cellStyle}
        onPress={this.itemPressed}
      />
    );
  }

  renderPages(pages = []) {
    const { selectedIndex } = this.state;

    const pageCount = this.getPageCount();

    if (!this.isPagingEnabled() || pageCount < 2) {
      return super.renderPages(pages);
    }

    return (
      <HorizontalPager
        data={pages}
        onIndexSelected={this.onIndexSelected}
        selectedIndex={selectedIndex}
        renderPage={this.renderPage}
        bounces
        showNextPage={false}
        renderOverlay={renderPageIndicators}
        scrollEnabled
      />
    );
  }
}

const mapPropsToStyleNames = (styleNames, props) => {
  const { cols, marginSize, rows } = props;

  styleNames.push(marginSize, `${rows}-rows`, `${cols}-columns`);

  return FolderBase.mapPropsToStyleNames(styleNames, props);
};

export default connectStyle(ICON_GRID, undefined, mapPropsToStyleNames)(IconGrid);
