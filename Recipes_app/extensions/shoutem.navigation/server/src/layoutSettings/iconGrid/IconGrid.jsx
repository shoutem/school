import React, { PropTypes } from 'react';
import BackgroundSettings from '../common/background-settings';
import provideScreenSettings from '../provideScreenSettings';
import GeneralSettings from './GeneralSettings';

export function IconGrid({ settings, childShortcuts, onSettingsChanged }) {
  return (
    <div>
      <GeneralSettings
        settings={settings}
        onSettingsChanged={onSettingsChanged}
      />
      <BackgroundSettings
        settings={settings}
        onSettingsChanged={onSettingsChanged}
        shortcuts={childShortcuts}
      />
    </div>
  );
}

IconGrid.propTypes = {
  settings: PropTypes.object.isRequired,
  onSettingsChanged: PropTypes.func.isRequired,
  childShortcuts: PropTypes.array.isRequired,
};

export default provideScreenSettings(IconGrid);
