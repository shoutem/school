import _ from 'lodash';
import { isEmail } from 'validator';

const ERROR_CODES = {
  DUPLICATE_PIN: 'lm_cashier_validation_pinInvalid',
  DUPLICATE_USER: 'lm_cashier_api_authError',
};

function validateRequiredField(value, name) {
  if (!value) {
    return `${name} is required`;
  }

  return null;
}

function validateEmail(email) {
  if (!email) {
    return 'Email is required';
  }

  if (!isEmail(email)) {
    return 'Email is not valid';
  }

  return null;
}

function validatePassword(password) {
  if (!password) {
    return 'Password is required';
  }

  if (password.length < 6) {
    return 'Password is too short';
  }

  return null;
}

export function validateCashier(cashier) {
  const { id, firstName, lastName, email, password } = cashier;
  const errors = {};

  errors.firstName = validateRequiredField(firstName, 'First name');
  errors.lastName = validateRequiredField(lastName, 'Last name');
  errors.pin = validateRequiredField(firstName, 'Pin');

  // email & password cannot be changed for existing users and don't have to be validated
  errors.email = _.isEmpty(id) ? validateEmail(email) : null;
  errors.password = _.isEmpty(id) ? validatePassword(password) : null;

  return errors;
}

export function getErrorMessage(errorCode) {
  if (errorCode === ERROR_CODES.DUPLICATE_PIN) {
    return { pin: 'Pin must be unique.' };
  }

  if (errorCode === ERROR_CODES.DUPLICATE_USER) {
    return { email: 'User with this email already exists.' };
  }

  return { _error: 'Something went wrong, please try again' };
}
