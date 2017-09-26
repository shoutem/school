import React, { Component, PropTypes} from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { shouldRefresh, isValid } from '@shoutem/redux-io';
import { updateShortcut, loadHierarchy, HIERARCHY } from './../reducer';
import { denormalizeItem } from 'denormalizer';
import ScreenGroup from './ScreenGroup';
import { LoaderContainer, EmptyResourcePlaceholder } from '@shoutem/react-web-ui';
import { ext } from 'context';
import { getShortcut } from 'environment';
import './style.scss';
import layoutImage from './../assets/layout.png';

export class LayoutPage extends Component {
  constructor(props) {
    super(props);

    this.checkData = this.checkData.bind(this);
    this.handleScreenSelected = this.handleScreenSelected.bind(this);
    this.renderScreenHierarchy = this.renderScreenHierarchy.bind(this);
  }

  componentWillMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.checkData(newProps);
  }

  checkData(props) {
    const { hierarchy, shortcut, loadHierarchy } = props;

    if (shouldRefresh(hierarchy)) {
      loadHierarchy(shortcut.id);
    }
  }

  getScreenMappings(shortcut) {
    const screens = _.get(shortcut, 'screens', []);
    return _.zipObject(
      _.map(screens, 'canonicalType'),
      _.map(screens, screen => _.pick(screen, ['canonicalName', 'canonicalType']))
    );
  }

  handleScreenSelected(event) {
    const { shortcut } = this.props;
    const {
      canonicalName: selectedCanonicalName,
      canonicalType: selectedCanonicalType,
    } = event;

    // When switching screens, we just need to change canonicalName.
    // Other settings (user's and default) will be handled on server side.
    // We also need to send the complete screen array to server, modifying only
    // canonicalName for screen of corresponding canonicalType.
    const screens = _.get(shortcut, 'screens', []);
    const newScreens = _.map(screens, screen => {
      const { canonicalType, canonicalName } = screen;

      if (canonicalType === selectedCanonicalType) {
        return {
          canonicalType: selectedCanonicalType,
          canonicalName: selectedCanonicalName,
        };
      }

      return {
        canonicalType,
        canonicalName,
      };
    });

    this.props.updateShortcut({
      id: shortcut.id,
      attributes: {
        screens: newScreens,
      },
    });
  }

  renderScreenHierarchy(hierarchy) {
    const screens = _.get(hierarchy, 'originalScreens', []);

    if (screens.length === 0) {
      return (
        <EmptyResourcePlaceholder
          className="layout-page__empty-placeholder"
          imageSrc={layoutImage}
          title="No layouts available"
        >
          <span>Screens should expose the list of available layouts or disable this tab.</span>
        </EmptyResourcePlaceholder>
      );
    }

    const { shortcut } = this.props;
    const screenMapping = this.getScreenMappings(shortcut);

    return (
      <div className="screen_group__container">
        {screens.map(screen => (
          <ScreenGroup
            key={screen.id}
            originalScreen={screen}
            activeScreenDescriptor={screenMapping[screen.canonicalName]}
            onScreenSelected={this.handleScreenSelected}
            shortcutId={shortcut.id}
          />
        ))}
      </div>
    );
  }

  render() {
    const { hierarchy } = this.props;
    const isHierarchyValid = hierarchy && isValid(hierarchy);

    return (
      <div className="layout-page">
        <LoaderContainer isLoading={!isHierarchyValid} size="50px">
          {this.renderScreenHierarchy(hierarchy)}
        </LoaderContainer>
      </div>
    );
  }
}

LayoutPage.propTypes = {
  shortcut: PropTypes.object,
  hierarchy: PropTypes.object,
  updateShortcut: PropTypes.func,
  loadHierarchy: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    shortcut: getShortcut(),
    hierarchy: denormalizeItem(state[ext()].layoutPage.hierarchy, undefined, HIERARCHY),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateShortcut: (shortcut) => dispatch(updateShortcut(shortcut)),
    loadHierarchy: (shortcutId) => dispatch(loadHierarchy(shortcutId)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LayoutPage);
