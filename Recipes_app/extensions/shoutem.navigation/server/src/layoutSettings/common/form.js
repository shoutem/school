import React, { Component } from 'react';
import _ from 'lodash';

// extracting value for form element: argument passed to this function can either be event or
// real value. In first case, we want to extract the value, in second case, just forward it out
const getValue = event => {
  const value = _.get(event, 'target.value', event);
  const type = _.get(event, 'target.type', event);

  if (type === 'checkbox') {
    return _.get(event, 'target.checked', event);
  }

  if (type === 'number') {
    return parseFloat(value) || 0;
  }

  return value;
};

export default function form(options) {
  return function (WrappedComponent) {
    return class Form extends Component {
      constructor(props) {
        super(props);
        this.registerSubscriber = this.registerSubscriber.bind(this);
        this.notifySubscribers = this.notifySubscribers.bind(this);
        this.getFormFields = this.getFormFields.bind(this);
        this.createField = this.createField.bind(this);

        const formFields = this.getFormFields(props);
        this.state = {
          formFields,
          subscribers: [],
          form: {
            toObject: () => _.mapValues(this.state.formFields, 'value'),
          },
        };
      }

      componentWillReceiveProps(nextProps) {
        const formFields = this.getFormFields(nextProps);
        this.setState({ formFields });
      }

      getFormFields(props) {
        const formOptions = _.isFunction(options)
          ? options(props)
          : options;

        const defaultValues = _.get(formOptions, 'defaultValues', {});
        const validation = _.get(formOptions, 'validation', {});

        return _.zipObject(formOptions.fields, _.map(formOptions.fields, f => (
            this.createField(f, defaultValues[f], validation[f], this.notifySubscribers)
          ))
        );
      }

      createField(name, defaultValue, validator, notifySubscribers) {
        return {
          name,
          value: defaultValue,
          onChange: (event) => {
            const formFields = this.state.formFields;

            formFields[name].value = getValue(event);

            this.setState({ formFields });
            notifySubscribers(formFields[name]);
          },
        };
      }

      registerSubscriber(s) {
        this.state.subscribers.push(s);
      }

      notifySubscribers(changedField) {
        this.state.subscribers.forEach(s => s(changedField));
      }

      render() {
        return (
          <WrappedComponent
            fields={this.state.formFields}
            onFieldChange={this.registerSubscriber}
            form={this.state.form}
            {...this.props}
          />
        );
      }
    };
  };
}
