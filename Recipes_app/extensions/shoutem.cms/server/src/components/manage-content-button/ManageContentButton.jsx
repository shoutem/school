import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { Button, ButtonGroup } from 'react-bootstrap';
import { FontIcon, LoaderContainer } from '@shoutem/react-web-ui';
import './style.scss';

export default class ManageContentButton extends Component {
  constructor(props) {
    super(props);

    this.handleCmsButtonClick = this.handleCmsButtonClick.bind(this);

    this.state = {
      inProgress: false,
    };
  }

  handleCmsButtonClick() {
    const { onNavigateToCmsClick } = this.props;

    this.setState({ inProgress: true });
    onNavigateToCmsClick().then(() => this.setState({ inProgress: false }));
  }

  render() {
    const { inProgress } = this.state;
    const {
      className,
      cmsButtonLabel,
      onNavigateToCmsClick,
      showAdvancedSetup,
      onToggleAdvancedSetup,
    } = this.props;

    const toggleButtonIcon = showAdvancedSetup ? 'arrow-drop-up' : 'arrow-drop-down';
    const toggleButtonClass = showAdvancedSetup ? 'primary' : 'default';
    const classes = classNames('manage-content-button', className);

    return (
      <ButtonGroup className={classes}>
        <Button
          bsSize="large"
          className="manage-content-button__items"
          onClick={onNavigateToCmsClick}
        >
          <LoaderContainer isLoading={inProgress}>
            {cmsButtonLabel}
          </LoaderContainer>
        </Button>
        <Button
          bsSize="large"
          bsStyle={toggleButtonClass}
          className="manage-content-button__advanced-setup"
          onClick={onToggleAdvancedSetup}
        >
          <FontIcon
            name={toggleButtonIcon}
            size="24px"
          />
        </Button>
      </ButtonGroup>
    );
  }
}

ManageContentButton.propTypes = {
  className: PropTypes.string,
  cmsButtonLabel: PropTypes.string,
  onNavigateToCmsClick: PropTypes.func,
  showAdvancedSetup: PropTypes.bool,
  onToggleAdvancedSetup: PropTypes.func,
};
