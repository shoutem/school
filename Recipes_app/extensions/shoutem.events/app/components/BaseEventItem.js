import React from 'react';

export class BaseEventItem extends React.Component {
  static propTypes = {
    onPress: React.PropTypes.func,
    action: React.PropTypes.func,
    event: React.PropTypes.object.isRequired,
    styleName: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
    this.action = this.action.bind(this);
  }

  onPress() {
    this.props.onPress(this.props.event);
  }

  action() {
    this.props.action(this.props.event);
  }
}
