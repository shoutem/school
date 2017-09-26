import React, {
  Component,
} from 'react';

import { Alert } from 'react-native';
import { connect } from 'react-redux';

import {
  Caption,
  Divider,
  DropDownMenu,
  FormGroup,
  Screen,
  ScrollView,
  TextInput,
} from '@shoutem/ui';

import _ from 'lodash';

import { NavigationBar } from '@shoutem/ui/navigation';
import { connectStyle } from '@shoutem/theme';

import countryData from 'world-countries';

import { ext } from '../../const';
import CartFooter from '../../components/CartFooter';
import { customer as customerShape } from '../../components/shapes';
import { updateCustomerInformation } from '../../redux/actionCreators';

const fields = [{
  autoCapitalize: 'none',
  name: 'email',
  label: 'Email',
  keyboardType: 'email-address',
},
{
  name: 'firstName',
  label: 'First name',
},
{
  name: 'lastName',
  label: 'Last name',
},
{
  name: 'address1',
  label: 'Address',
},
{
  name: 'city',
  label: 'City',
},
{
  name: 'province',
  label: 'Province',
},
{
  name: 'zip',
  label: 'Postal code',
}];

const { func } = React.PropTypes;

// TODO: Where to put this transformation? We need it because the ListView can reference
// only first level and not nested properties
const loadCountries = () => _.sortBy(_.map(countryData, ({ name: { common: name }, cca2 }) =>
({ name, cca2 })), 'name');

const emptyOption = { name: 'Select', cca2: '' };
const countries = [emptyOption, ...loadCountries()];

/**
 * Lets the user enter his email and address when performing a checkout with selected
 * cart items. If the information he enters is valid, the component forwards him to the
 * next step, usually selecting a shipping method
 */
class CheckoutScreen extends Component {
  static propTypes = {
    // The customer performing the checkout
    customer: customerShape,
    // Action dispatched when proceeding to the next step
    updateCustomerInformation: func.isRequired,
  };

  constructor(props) {
    super(props);

    this.onCountrySelected = this.onCountrySelected.bind(this);
    this.proceedToShippingMethod = this.proceedToShippingMethod.bind(this);
    this.renderInput = this.renderInput.bind(this);

    this.state = { ...props.customer };
  }

  onCountrySelected(country) {
    this.setState({ countryCode: country.cca2, countryName: country.name });
  }

  proceedToShippingMethod() {
    const { updateCustomerInformation } = this.props;
    const { countryCode } = this.state;

    const values = _.map(fields, ({ name }) => this.state[name]);

    if (_.some(values, _.isEmpty) || !countryCode) {
      Alert.alert('Error', 'All fields are mandatory check if you forgot to fill some.');
      return;
    }
    // TODO: Local state contains only customer info so this is a clean practical way of getting
    // all of these values. Any other ideas?
    const customerInformation = { ...this.state };

    updateCustomerInformation(customerInformation);
  }

  renderInput(field) {
    const { autoCapitalize, name, label, keyboardType } = field;

    return (
      <FormGroup key={name}>
        <Caption>{label.toUpperCase()}</Caption>
        <TextInput
          placeholder={label}
          autoCapitalize={autoCapitalize || 'words'}
          autoCorrect={false}
          keyboardAppearance="light"
          keyboardType={keyboardType || 'default'}
          onChangeText={text => this.setState({ [name]: text })}
          returnKeyType="done"
          value={this.state[name]}
        />
        <Divider styleName="line sm-gutter-bottom" />
      </FormGroup>
    );
  }

  renderCountryPicker() {
    const { countryCode } = this.state;
    const selectedCountry = _.find(countries, { 'cca2': countryCode });

    return (
      <FormGroup>
        <Caption>COUNTRY</Caption>
        <DropDownMenu
          onOptionSelected={this.onCountrySelected}
          options={countries}
          selectedOption={selectedCountry || countries[0]}
          styleName={countryCode ? '' : 'empty'}
          titleProperty={'name'}
          valueProperty={'cca2'}
        />
      </FormGroup>
    );
  }

  render() {
    return (
      <Screen>
        <NavigationBar title="CHECKOUT" />
        <ScrollView>
          {_.map(fields, this.renderInput)}
          {this.renderCountryPicker()}
        </ScrollView>
        <Divider styleName="line" />
        <CartFooter
          action="CONTINUE"
          onActionButtonClicked={this.proceedToShippingMethod}
        />
      </Screen>
    );
  }
}

const mapStateToProps = (state) => {
  const { customer } = state[ext()];

  return {
    customer,
  };
};

export default connect(mapStateToProps, { updateCustomerInformation })(
  connectStyle(ext('CheckoutScreen'))(CheckoutScreen),
);
