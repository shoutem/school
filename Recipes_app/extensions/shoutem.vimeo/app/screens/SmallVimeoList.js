import React from 'react';
import { connect } from 'react-redux';

import { connectStyle } from '@shoutem/theme';

import { ext } from '../extension';

import { VimeoList, mapStateToProps, mapDispatchToProps } from './VimeoList';
import SmallVimeoView from '../components/SmallVimeoView';

class SmallVimeoList extends VimeoList {
  renderRow(video) {
    return (
      <SmallVimeoView video={video} onPress={this.openDetailsScreen} />
    );
  }
}

export default connectStyle(ext('SmallVimeoList'))(
  connect(mapStateToProps, mapDispatchToProps)(SmallVimeoList),
);
