import React, { PropTypes, Component } from 'react';
import { ControlLabel, Row, Col, FormGroup } from 'react-bootstrap';
import form from '../common/form';
import DropdownWrapper from '../common/DropdownWrapper';
import CheckboxWrapper from '../common/CheckboxWrapper';

const configuration = {
  default: {
    cardHeight: 'medium',
    itemGutter: 'medium',
    itemText: 'topLeft',
  },
  cardHeight: {
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
  },
  itemGutter: {
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    noGutter: 'No gutter',
  },
  itemText: {
    noText: 'No text',
    topLeft: 'Top left',
    topCenter: 'Top center',
    topRight: 'Top right',
    middleLeft: 'Middle left',
    middleCenter: 'Middle center',
    middleRight: 'Middle right',
    bottomLeft: 'Bottom left',
    bottomCenter: 'Bottom center',
    bottomRight: 'Bottom right',
  },
};

export class GeneralSettings extends Component {
  constructor(props) {
    super(props);
    this.saveForm = this.saveForm.bind(this);

    props.onFieldChange(this.saveForm, 1000);
  }

  saveForm() {
    const newSettings = this.props.form.toObject();
    this.props.onSettingsChanged(newSettings);
  }

  render() {
    const { fields } = this.props;
    const {
      cardHeight,
      itemGutter,
      itemText,
      isFullWidth,
    } = fields;

    return (
      <div>
        <h3>General settings</h3>
        <form>
          <FormGroup>
            <Row>
              <Col md={4}>
                <ControlLabel>Item height</ControlLabel>
                <DropdownWrapper
                  valuesMap={configuration.cardHeight}
                  defaultKey={configuration.default.cardHeight}
                  field={cardHeight}
                />
              </Col>
              <Col md={4}>
                <ControlLabel>Gutter settings</ControlLabel>
                <DropdownWrapper
                  valuesMap={configuration.itemGutter}
                  defaultKey={configuration.default.itemGutter}
                  field={itemGutter}
                />
              </Col>
              <Col md={4}>
                <ControlLabel>Text settings</ControlLabel>
                <DropdownWrapper
                  valuesMap={configuration.itemText}
                  defaultKey={configuration.default.itemText}
                  field={itemText}
                />
              </Col>
            </Row>
          </FormGroup>
          <FormGroup className="general-settings__checkbox-container">
            <Row>
              <Col md={6}>
                <CheckboxWrapper {...isFullWidth}>Full-width item span</CheckboxWrapper>
              </Col>
            </Row>
          </FormGroup>
        </form>
      </div>
    );
  }
}

GeneralSettings.propTypes = {
  settings: PropTypes.object.isRequired,
  onSettingsChanged: PropTypes.func.isRequired,
  fields: PropTypes.object.isRequired,
  form: PropTypes.object,
  onFieldChange: PropTypes.func,
};

export default form((props) => {
  const { settings } = props;
  return {
    fields: ['cardHeight', 'itemGutter', 'itemText', 'isFullWidth'],
    defaultValues: {
      cardHeight: settings.cardHeight,
      itemGutter: settings.itemGutter,
      itemText: settings.itemText,
      isFullWidth: settings.isFullWidth,
    },
    validation: {},
  };
})(GeneralSettings);
