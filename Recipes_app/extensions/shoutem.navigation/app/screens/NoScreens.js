import React from 'react';
import { connectStyle } from '@shoutem/theme';
import { Screen } from '@shoutem/ui';
import { NavigationBar } from '@shoutem/ui/navigation';
import { EmptyStateView } from '@shoutem/ui-addons';
import { ext } from '../const';

function NoScreens() {
  return (
    <Screen styleName="paper">
      <NavigationBar hidden />
      <EmptyStateView message={"Sorry, this app doesn't have any screens to open."} />
    </Screen>
  );
}

export default connectStyle(ext('NoScreens'))(NoScreens);
