import React from 'react';
import { connectStyle } from '@shoutem/theme';
import { Screen } from '@shoutem/ui';
import { NavigationBar } from '@shoutem/ui/navigation';
import { EmptyStateView } from '@shoutem/ui-addons';
import { ext } from '../const';

function NoContent({ title }) {
  return (
    <Screen styleName="full-screen paper">
      <NavigationBar title={title} />
      <EmptyStateView message={"This screen has no content."} />
    </Screen>
  );
}

NoContent.propTypes = {
  title: React.PropTypes.string,
};

export default connectStyle(ext('NoContent'))(NoContent);
