import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { LoaderContainer, EmptyResourcePlaceholder } from '@shoutem/react-web-ui';
import emptyImage from '../../../assets/images/empty-state-loyalty.svg';
import './style.scss';

export default class LoyaltyDisabledPlaceholder extends Component {
  constructor(props) {
    super(props);

    this.handleEnableLoyaltyClick = this.handleEnableLoyaltyClick.bind(this);

    this.state = {
      inError: false,
      inProgress: false,
    };
  }

  handleEnableLoyaltyClick() {
    const { onEnableLoyaltyClick } = this.props;
    this.setState({ inProgress: true });

    onEnableLoyaltyClick()
      .then(() => this.setState({ inProgress: false }),
        () => this.setState({ inError: true }));
  }

  render() {
    const { inError, inProgress } = this.state;
    const displayButtonLabel = inError ? 'Try again' : 'Get started';

    return (
      <EmptyResourcePlaceholder
        imageSrc={emptyImage}
        title="Loyalty is not configured at the moment"
        className="loyalty-disabled-placeholder"
      >
        <p>
          Here you will be able to configure your loyalty program settings,
          add cashiers and define rules.
        </p>
        <Button bsStyle="primary" bsSize="large" onClick={this.handleEnableLoyaltyClick}>
          <LoaderContainer isLoading={inProgress}>
            {displayButtonLabel}
          </LoaderContainer>
        </Button>
        {inError && <p className="text-error">Failed to enable.</p>}
      </EmptyResourcePlaceholder>
    );
  }
}

LoyaltyDisabledPlaceholder.propTypes = {
  onEnableLoyaltyClick: PropTypes.func,
};
