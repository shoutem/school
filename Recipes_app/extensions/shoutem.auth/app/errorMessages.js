export const errorMessages = Object.freeze({
  EMAIL_UNKNOWN: 'Your username / email was not found.',
  INVALID_CREDENTIALS: 'Wrong password. Please try again.',
  SIGNUP_EMAIL_INVALID: 'Wrong email format. Make sure your email format is name@domain.com.',
  SIGNUP_USERNAME_INVALID: 'Please change the username so it has at least 3 characters, ' +
    'starts with a letter and contains only letters, numbers and underscores.',
  SIGNUP_PASSWORD_INVALID: 'Password has to be at least 6 characters long. Please try again.',
  EMPTY_FIELDS: 'All of the fields must be filled. Please try again.',
  UNEXPECTED_ERROR: 'Unexpected error.',
});

export const getErrorMessage = errorCode =>
    errorMessages[errorCode] || errorMessages.UNEXPECTED_ERROR;
