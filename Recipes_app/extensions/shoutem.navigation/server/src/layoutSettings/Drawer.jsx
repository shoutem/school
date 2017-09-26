import React, { PropTypes } from 'react';
import { FormGroup } from 'react-bootstrap';
import provideScreenSettings from './provideScreenSettings';
import StartingScreen from './common/StartingScreen';
import IconsAndText from './common/IconsAndText';

export function Drawer({ settings, onSettingsChanged, childShortcuts }) {
  return (
    <div>
      <h3>Settings</h3>
      <form>
        <FormGroup>
          <StartingScreen
            settings={settings}
            childShortcuts={childShortcuts}
            onSettingsChanged={onSettingsChanged}
          />
        </FormGroup>
        <FormGroup>
          <IconsAndText
            settings={settings}
            onSettingsChanged={onSettingsChanged}
          />
        </FormGroup>
      </form>
    </div>
  );
}

Drawer.propTypes = {
  settings: PropTypes.object.isRequired,
  onSettingsChanged: PropTypes.func.isRequired,
  childShortcuts: PropTypes.array.isRequired,
};

export default provideScreenSettings(Drawer);
