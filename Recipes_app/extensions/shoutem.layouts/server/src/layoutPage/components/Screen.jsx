import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class Screen extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { isActive, onClick, screen } = this.props;
    const { canonicalType, canonicalName } = screen;

    if (isActive) {
      return;
    }

    onClick({ canonicalName, canonicalType });
  }

  render() {
    const { screen, isActive } = this.props;
    const screenClasses = classNames('screen_group__screen', {
      'is-active': isActive,
    });

    return (
      <div className={screenClasses} onClick={this.handleClick}>
        <div className="screen_group__screen-bezel">
          {screen.image && <img className="screen_group__screen-image" src={screen.image} />}
        </div>
        <div className="screen_group__screen_name">
          {screen.title}
        </div>
      </div>
    );
  }
}

Screen.propTypes = {
  screen: PropTypes.object,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
};
