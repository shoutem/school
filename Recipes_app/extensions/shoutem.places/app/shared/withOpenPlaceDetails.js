import React, { Component } from 'react';
import { connect } from 'react-redux';
import { navigateTo } from '@shoutem/core/navigation';
import { ext } from '../const';

/**
 * Wraps the received component with the method used to navigate to the
 * place details screen. Also, second parameter allows us to control the prop name
 * of the wrapped component, to which we assing the openPlaceDetailsScreen method
 *
 * @param RowComponent {object} Underlying component to which we apply HOC
 * @param prop {string} Prop name of underlying component, to which we pass the
 * openPlaceDetailsScreen handler, used to navigate to Details screen
 * @returns {object} Wrapped component
 */
export default function withOpenPlaceDetails(RowComponent, prop = 'onPress') {
  class EnhancedComponent extends Component {
    constructor(props) {
      super(props);
      this.openPlaceDetailsScreen = this.openPlaceDetailsScreen.bind(this);
    }

    openPlaceDetailsScreen() {
      const { place, navigateTo } = this.props;

      navigateTo({
        screen: ext('PlaceDetails'),
        title: place.name,
        props: {
          place,
        },
      });
    }

    render() {
      const passedProps = {
        ...this.props,
        [prop]: this.openPlaceDetailsScreen,
      };

      return <RowComponent {...passedProps} />;
    }
  }

  EnhancedComponent.propTypes = {
    place: React.PropTypes.object,
    navigateTo: React.PropTypes.func,
  };

  return connect(undefined, { navigateTo })(EnhancedComponent);
}
