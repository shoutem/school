import React, {
  PureComponent,
} from 'react';

import { connect } from 'react-redux';

import {
  ScreenStack,
  navigateBack,
  closeModal,
} from '@shoutem/core/navigation';

import { connectStyle } from '@shoutem/theme';

import {
  View,
  Screen,
  Button,
  Icon,
} from '@shoutem/ui';

import { ChildNavigationBar } from '@shoutem/ui/navigation';

import { ext } from '../const';

class Modal extends PureComponent {
  static propTypes = {
    closeModal: React.PropTypes.func,
    navigationState: React.PropTypes.object,
    style: React.PropTypes.object,
    navigateBack: React.PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
    this.closeModal = this.closeModal.bind(this);
  }

  closeModal() {
    const { closeModal } = this.props;

    closeModal();
  }

  getNavbarProps() {
    const { navigationState } = this.props;

    if (navigationState.index > 0) {
      return { renderLeftComponent: undefined };
    }

    return {
      renderLeftComponent: () => (
        <View virtual styleName="container">
          <Button onPress={this.closeModal}>
            <Icon name="close" />
          </Button>
        </View>
      ),
    }
  }

  render() {
    const { navigationState, navigateBack } = this.props;

    return (
      <Screen>
        <ChildNavigationBar {...this.getNavbarProps()} />
        <ScreenStack
          navigationState={navigationState}
          onNavigateBack={navigateBack}
        />
      </Screen>
    );
  }
}

const mapStateToProps = state => ({ navigationState: state[ext()].modal.navigation });
const mapDispatchToProps = { closeModal, navigateBack };

export default connect(mapStateToProps, mapDispatchToProps)(connectStyle(ext('Modal'))(Modal));
