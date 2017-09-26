import React from 'react';

const { bool, number, shape, string } = React.PropTypes;

const pushGroup = shape({
  // Group ID
  id: number,
  // Image URL for the groups's thumbnail
  imageUrl: string,
  // Group name
  name: string,
  // True if the group should be subscribed to on app launch, false otherwise
  subscribeByDefault: bool,
  // Group tag, used for subscribtions
  tag: string,
});

export { pushGroup };
