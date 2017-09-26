import React, {
  Component,
} from 'react';

import { Alert } from 'react-native';

import { connect } from 'react-redux';
import _ from 'lodash';

import { isProduction } from 'shoutem.application';
import { Permissions } from 'shoutem.push-notifications';

import {
  Divider,
  ListView,
  Row,
  Screen,
  Subtitle,
  Switch,
  View,
} from '@shoutem/ui';

import { NavigationBar } from '@shoutem/ui/navigation';
import { EmptyStateView } from '@shoutem/ui-addons';
import { connectStyle } from '@shoutem/theme';

import { fetchGroups, selectPushNotificationGroups } from '../redux';

import { ext, GROUP_PREFIX } from '../const';
import { pushGroup as pushGroupShape } from '../components/shapes';

const TITLE = 'SETTINGS';

const { arrayOf, func, string } = React.PropTypes;

const renderEmptyScreen = () => (
  <EmptyStateView message={'There are no push groups defined'} />
);

const showPreviewModeNotification = () => {
  Alert.alert(
    'Preview mode',
    'Push notifications are not supported in preview mode. ' +
      'You can see groups but you can\'t toggle subscriptions. Everything ' +
      'does work in the app!',
  );
};

const showSuggestionToEnableNotifications = () => {
  Alert.alert(
    'Enable notifications',
    'You disabled push notifications for this application. Do you want to enable them in' +
      ' settings now?',
    [
      { text: 'Go to settings', onPress: () => Permissions.openSettings() },
      { text: 'Cancel' },
    ],
  );
};

/**
 * Displays a list of push groups for this app and marks those that the user is subscribed to.
 * It also lets the user subscribe or unsubscribe from groups.
 */
export class PushGroupsList extends Component {
  static propTypes = {
    // All push groups for the app
    groups: arrayOf(pushGroupShape).isRequired,
    // Fetches push groups
    fetchGroups: func,
    // Tags of push groups that the user is subscribed to
    selectedGroups: arrayOf(string).isRequired,
    // Used to subscribe and unsubscribe from groups
    selectPushNotificationGroups: func.isRequired,
  };

  constructor(props) {
    super(props);

    this.onToggleGroupSubscription = this.onToggleGroupSubscription.bind(this);
    this.renderRow = this.renderRow.bind(this);

    this.state = { areNotificationsEnabled: false };
  }

  componentDidMount() {
    const { fetchGroups } = this.props;

    fetchGroups();

    // Push groups and notifications are not enabled when there are no certificates set up.
    // They are usually set up only in production environments
    if (!isProduction()) {
      showPreviewModeNotification();
      return;
    }

    this.checkIfNotificationsAreEnabled();
  }

  onToggleGroupSubscription(tag, value) {
    const { selectPushNotificationGroups } = this.props;

    const added = value ? [tag] : [];
    const removed = value ? [] : [tag];

    selectPushNotificationGroups({ added, removed });
  }

  checkIfNotificationsAreEnabled() {
    Permissions.arePushNotificationsEnabled((result) => {
      if (!result) {
        showSuggestionToEnableNotifications();
      }
    });
  }

  renderRow(group) {
    const { tag, name } = group;
    const { selectedGroups } = this.props;

    const prefixedTag = `${GROUP_PREFIX + tag}`;

    return (
      <View>
        <Row styleName="small space-between">
          <Subtitle>{name}</Subtitle>
          <Switch
            value={_.includes(selectedGroups, prefixedTag)}
            onValueChange={value => this.onToggleGroupSubscription(prefixedTag, value)}
          />
        </Row>
        <Divider styleName="line" />
      </View>

    );
  }

  render() {
    const { groups } = this.props;

    if (_.isEmpty(groups)) {
      return renderEmptyScreen();
    }

    return (
      <Screen>
        <NavigationBar title={TITLE} />
        <View styleName="md-gutter solid">
          <Subtitle styleName="h-center">Send me a push notification for</Subtitle>
        </View>
        <ListView
          data={[...groups]}
          renderRow={this.renderRow}
        />
      </Screen>
    );
  }
}

export const mapStateToProps = state => ({
  groups: state[ext()].groups.data || [],
  selectedGroups: state[ext()].selectedGroups || [],
});

export default connect(mapStateToProps, { fetchGroups, selectPushNotificationGroups })(
  connectStyle(ext('PushGroupsListScreen'))(PushGroupsList),
);
