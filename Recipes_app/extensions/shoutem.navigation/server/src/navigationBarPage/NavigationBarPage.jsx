import
  React,
  {
    PropTypes,
    Component,
  } from 'react';

import {
  getExtensionInstallation,
} from 'environment';

import {
  Row,
  Col,
} from 'react-bootstrap';

import { connect } from 'react-redux';

import {
  updateExtensionSettings,
} from '../builder-sdk';

import NavigationBarBackgroundImage from './components/NavigationBarBackgroundImage';
import NavigationBarFirstScreenImageToggle from './components/NavigationBarFirstScreenImageToggle';
import NavigationBarTitleToggle from './components/NavigationBarTitleToggle';
import NavigationBarBackgroundSize from './components/NavigationBarBackgroundSize';

// Import styles
import './style.scss';

const BACKGROUND_IMAGE = 'backgroundImage';
const BACKGROUND_IMAGE_ENABLED_FIRST_SCREEN = 'backgroundImageEnabledFirstScreen';
const SHOW_TITLE = 'showTitle';
const FIT_CONTAINER = 'fitContainer';

export class NavigationBarPage extends Component {
  constructor(props) {
    super(props);

    // Bind handler methods to preserve real "this" reference
    this.handleBackgroundImageChange = this.handleBackgroundImageChange.bind(this);
    this.handleBackgroundImageToggle = this.handleBackgroundImageToggle.bind(this);
    this.handleBackgroundSizeToggle = this.handleBackgroundSizeToggle.bind(this);
    this.handleTitleToggle = this.handleTitleToggle.bind(this);
  }

  /**
   * Handle background image upload or delete
   * @param {void} backgroundImage
   */
  handleBackgroundImageChange(backgroundImage = null) {
    this.updateExtensionSettings({
      [BACKGROUND_IMAGE]: backgroundImage,
    });
  }

  /**
   * Handle background image toggle
   * @param  {Number} selectedValue Option value corresponding *_OPTION constants
   * @return {void}
   */
  handleBackgroundImageToggle(backgroundImageEnabledFirstScreen) {
    this.updateExtensionSettings({
      [BACKGROUND_IMAGE_ENABLED_FIRST_SCREEN]: backgroundImageEnabledFirstScreen,
    });
  }

  /**
   * Handle background size toggle. It can either keep original size and fit to height
   * or it can fit image to dimensions of a container.
   * @param {void} fitContainer
   */
  handleBackgroundSizeToggle(fitContainer) {
    this.updateExtensionSettings({
      [FIT_CONTAINER]: fitContainer,
    });
  }

  /**
   * Handle title toggle
   * @param  {event} evt Event object sent from radio button input control
   * @return {void}
   */
  handleTitleToggle(showTitle) {
    this.updateExtensionSettings({
      [SHOW_TITLE]: showTitle,
    });
  }

  /**
   * Update extension settings with lates changes.
   * Only diff values are required here.
   * @param {void} settings
   */
  updateExtensionSettings(settings) {
    const { updateSettings, extensionInstallation } = this.props;
    return updateSettings(extensionInstallation, settings);
  }

  render() {
    const { extensionInstallation: { settings } } = this.props;
    const {
      backgroundImage,
      backgroundImageEnabledFirstScreen,
      showTitle,
      fitContainer,
    } = settings;

    return (
      <div className="navigation-bar-page">
        <form>
          <Row>
            <Col md={12}>
              <NavigationBarBackgroundImage
                backgroundImage={backgroundImage}
                onBackgroundImageChange={this.handleBackgroundImageChange}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <NavigationBarFirstScreenImageToggle
                backgroundImageEnabledFirstScreen={backgroundImageEnabledFirstScreen}
                onBackgroundImageToggle={this.handleBackgroundImageToggle}
              />
            </Col>
            <Col md={6}>
              <NavigationBarBackgroundSize
                fitContainer={fitContainer}
                onBackgroundSizeToggle={this.handleBackgroundSizeToggle}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <NavigationBarTitleToggle
                showTitle={showTitle}
                onTitleToggle={this.handleTitleToggle}
              />
            </Col>
          </Row>
        </form>
      </div>
    );
  }
}

/**
 * NavigationBarSettings export
 */

NavigationBarPage.propTypes = {
  extensionInstallation: PropTypes.object,
  updateSettings: PropTypes.func,
};

function mapStateToProps() {
  const extensionInstallation = getExtensionInstallation();

  return {
    extensionInstallation,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateSettings: (extensionInstallation, settings) =>
      dispatch(updateExtensionSettings(extensionInstallation, settings)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NavigationBarPage);
