import React from 'react';

const { shape, string } = React.PropTypes;

const user = shape({
  // User's bio
  description: string,
  // User's e-mail address, that he registered with
  email: string,
  // First and last name
  name: string,
  // User location
  location: string,
  // The URL of user's website
  url: string,
});

export { user };
