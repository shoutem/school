import React from 'react';
import { connect } from 'react-redux';
import { getShortcut, getExtension } from '@shoutem/redux-api-sdk';

export function connectPageContext(WrappedComponent) {
  function PageProvider(props, context) {
    const { page } = context;
    const pageProps = _.pick(page.getPageContext(), [
      'appId',
      'extensionName',
      'ownExtensionName',
      'shortcutId',
      'screenId',
    ]);

    const parameters = page.getParameters();

    return (<WrappedComponent {...pageProps} parameters={parameters} />);
  }

  PageProvider.contextTypes = {
    page: React.PropTypes.object,
  };

  return PageProvider;
}

function mapStateToProps(state, ownProps) {
  const { shortcutId, extensionName, ownExtensionName } = ownProps;

  return {
    shortcut: getShortcut(state, shortcutId),
    extension: getExtension(state, extensionName),
    ownExtension: getExtension(state, ownExtensionName),
  };
}

export default function connectPage() {
  return wrappedComponent => connectPageContext(connect(mapStateToProps)(wrappedComponent));
}
