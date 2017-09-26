import React, { PropTypes } from 'react';

export default function None() {
  return (
    <div />
  );
}

None.propTypes = {
  settings: PropTypes.object.isRequired,
  onSettingsChanged: PropTypes.func.isRequired,
  childShortcuts: PropTypes.array.isRequired,
};
