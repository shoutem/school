import React, { PropTypes } from 'react';
import BackgroundSettings from '../common/background-settings';
import provideScreenSettings from '../provideScreenSettings';
import GeneralSettings from './GeneralSettings';

export function List({ settings, childShortcuts, onSettingsChanged }) {
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

List.propTypes = {
  settings: PropTypes.object.isRequired,
  onSettingsChanged: PropTypes.func.isRequired,
  childShortcuts: PropTypes.array.isRequired,
};

export default provideScreenSettings(List);
