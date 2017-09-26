import React from 'react';

import _ from 'lodash';

import {
  EmptyStateView,
} from '@shoutem/ui-addons';

import { ListScreen } from 'shoutem.application';

const { func, string } = React.PropTypes;

export class RssListScreen extends ListScreen {
  static propTypes = {
    ...ListScreen.propTypes,
    // The url of the RSS feed to display
    feedUrl: string,

    // Actions
    navigateTo: func,
    find: func,
    next: func.isRequired,
  };

  fetchData() {
    const { feedUrl, find } = this.props;
    const { schema } = this.state;

    if (!feedUrl) {
      return;
    }

    find(schema, undefined, {
      'filter[url]': feedUrl,
    });
  }

  shouldRenderPlaceholderView(data) {
    const { feedUrl } = this.props;

    if (_.isUndefined(feedUrl)) {
      return true;
    }

    return super.shouldRenderPlaceholderView(data);
  }

  renderPlaceholderView(data) {
    const { feedUrl, style } = this.props;

    if (_.isUndefined(feedUrl)) {
      // If feed doesn't exist (`feedUrl` is undefined), notify user to specify feed URL
      // and reload app, because `feedUrl` is retrieved through app configuration
      const emptyStateViewProps = {
        icon: 'error',
        message: 'Please specify RSS feed URL and reload your app.',
        style: style.emptyState,
      };

      return (
        <EmptyStateView {...emptyStateViewProps} />
      );
    }

    return super.renderPlaceholderView(data);
  }
}
