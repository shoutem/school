import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import { ControlLabel, Row, Col, FormGroup } from 'react-bootstrap';
import form from '../common/form';
import IconsAndText from '../common/IconsAndText';
import DropdownWrapper from '../common/DropdownWrapper';

const configuration = {
  default: {
    iconSize: 'medium',
    inItemAlignment: 'left',
    listAlignment: 'top',
  },
  iconSize: {
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
  },
  inItemAlignment: {
    left: 'Left',
    center: 'Center',
    right: 'Right',
  },
  listAlignment: {
    top: 'Top',
    middle: 'Middle',
    bottom: 'Bottom',
  },
};

export class GeneralSettings extends Component {
  constructor(props) {
    super(props);
    this.saveForm = this.saveForm.bind(this);

    props.onFieldChange(this.saveForm);
  }

  saveForm() {
    const layoutSettings = this.props.form.toObject();
    this.props.onSettingsChanged(layoutSettings);
  }

  render() {
    const { fields, settings, onSettingsChanged } = this.props;
    const {
      topOffset,
      listAlignment,
      inItemAlignment,
      iconSize,
    } = fields;
    const showIcon = _.get(settings, ['showIcon'], true);

    return (
      <div>
        <h3>General settings</h3>
        <form>
          <FormGroup>
            <Row>
              <Col md={6}>
                <IconsAndText
                  settings={settings}
                  onSettingsChanged={onSettingsChanged}
                />
              </Col>
              <Col md={6}>
                <ControlLabel>Icon size</ControlLabel>
                <DropdownWrapper
                  valuesMap={configuration.iconSize}
                  defaultKey={configuration.default.iconSize}
                  field={iconSize}
                  disabled={!showIcon}
                />
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Row>
              <Col md={4}>
                <ControlLabel>List alignment</ControlLabel>
                <DropdownWrapper
                  valuesMap={configuration.listAlignment}
                  defaultKey={configuration.default.listAlignment}
                  field={listAlignment}
                />
              </Col>
              <Col md={4}>
                <ControlLabel>Offset from top (px)</ControlLabel>
                <input name="cols" type="number" className="form-control" {...topOffset} />
              </Col>
              <Col md={4}>
                <ControlLabel>In-item alignment</ControlLabel>
                <DropdownWrapper
                  valuesMap={configuration.inItemAlignment}
                  defaultKey={configuration.default.inItemAlignment}
                  field={inItemAlignment}
                />
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
    fields: ['topOffset', 'listAlignment', 'inItemAlignment', 'iconSize'],
    defaultValues: {
      topOffset: settings.topOffset,
      listAlignment: settings.listAlignment,
      inItemAlignment: settings.inItemAlignment,
      iconSize: settings.iconSize,
    },
    validation: {},
  };
})(GeneralSettings);
