import React, { PureComponent } from 'react';

import _ from 'lodash';

import {
  Screen,
  ListView,
} from '@shoutem/ui';

import {
  NavigationBar,
} from '@shoutem/ui/navigation';

import {
  EmptyStateView,
} from '@shoutem/ui-addons';

import {
  isBusy,
  isInitialized,
  isError,
  shouldRefresh,
} from '@shoutem/redux-io';

const { array, func, shape, string } = React.PropTypes;

/* eslint-disable  class-methods-use-this */

export default class RemoteDataListScreen extends PureComponent {
  static propTypes = {
    // The shortcut title
    title: string,

    // Data items to display
    // eslint-disable-next-line  react/forbid-prop-types
    data: array,

    // Actions
    next: func.isRequired,
    // Component style
    style: shape({
      screen: Screen.propTypes.style,
      list: ListView.propTypes.style,
      emptyState: EmptyStateView.propTypes.style,
    }),
  };

  static defaultProps = {
    style: {
      screen: {},
      list: {},
      emptyState: {},
    },
  };

  constructor(props, context) {
    super(props, context);
    this.fetchData = this.fetchData.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  componentWillMount() {
    const { data } = this.props;

    if (shouldRefresh(data, true)) {
      this.fetchData();
    }
  }

  getNavigationBarProps() {
    const { title } = this.props;
    return {
      title: (title || '').toUpperCase(),
    };
  }

  getListProps() {
    return {};
  }

  // Override this function if you want custom sections
  getSectionId() {
    return null;
  }

  loadMore() {
    this.props.next(this.props.data);
  }

 /*
  * Override this function to implement specific data fetching.
  * It's empty since it's called to refresh data.
  */
  fetchData() {

  }

  shouldRenderPlaceholderView(data) {
    if ((!isInitialized(data) && !isError(data)) || isBusy(data)) {
      // Data is loading, treat it as valid for now
      return false;
    }

    // We want to render a placeholder in case of errors or if data is empty
    return isError(data) || !_.size(data);
  }

  renderPlaceholderView(data) {
    const { style } = this.props;

    const emptyStateViewProps = {
      icon: 'refresh',
      message: isError(data) ?
        'Unexpected error occurred.' :
        'Nothing here at this moment.',
      onRetry: this.fetchData,
      retryButtonTitle: 'TRY AGAIN',
      style: style.emptyState,
    };

    return (
      <EmptyStateView {...emptyStateViewProps} />
    );
  }

  // Override this function if you want custom section headers. Used with getSectionId.
  renderSectionHeader() {
    return null;
  }

  // Override this function to render data items
  // eslint-disable-next-line no-unused-vars
  renderRow(item) {
    return null;
  }

  renderData(data) {
    if (this.shouldRenderPlaceholderView(data)) {
      return this.renderPlaceholderView(data);
    }

    return (
      <ListView
        data={data}
        getSectionId={this.getSectionId}
        renderRow={this.renderRow}
        loading={isBusy(data) || !isInitialized(data)}
        onRefresh={this.fetchData}
        onLoadMore={this.loadMore}
        renderSectionHeader={this.renderSectionHeader}
        style={this.props.style.list}
        initialListSize={1}
        {...this.getListProps()}
      />
    );
  }

  render() {
    const { data, style } = this.props;
    const navigationBarProps = this.getNavigationBarProps();

    return (
      <Screen style={style.screen}>
        <NavigationBar {...navigationBarProps} />
        {this.renderData(data)}
      </Screen>
    );
  }
}
