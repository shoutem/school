import React, {
  Component,
} from 'react';

import { connect } from 'react-redux';

import {
  InteractionManager,
} from 'react-native';

import {
  ListView,
  Screen,
} from '@shoutem/ui';

import { NavigationBar } from '@shoutem/ui/navigation';

import { connectStyle } from '@shoutem/theme';

import {
  fetchNotifications,
  markAsRead,
} from '../redux';

import NotificationRow from '../components/NotificationRow';

import { ext } from '../const';

const TITLE = 'NOTIFICATIONS';

class NotificationsList extends Component {
  static propTypes = {
    notifications: React.PropTypes.arrayOf(React.PropTypes.object),
    getNotifications: React.PropTypes.func.isRequired,
    onNotificationPress: React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.getNotifications = this.getNotifications.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  componentDidMount() {
    const { getNotifications } = this.props;
    InteractionManager.runAfterInteractions(() => {
      getNotifications();
    });
  }

  getNotifications() {
    return this.props.notifications || [];
  }

  renderRow(notification) {
    const onPress = this.props.onNotificationPress(notification);
    return (
      <NotificationRow
        {...notification}
        onPress={onPress}
      />
    );
  }

  render() {
    return (
      <Screen>
        <NavigationBar title={TITLE} />
        <ListView
          data={this.getNotifications()}
          renderRow={notification => this.renderRow(notification)}
        />
      </Screen>
    );
  }
}

const mapStateToProps = state => ({
  notifications: state[ext()].inbox.data,
});

export const mapDispatchToProps = dispatch => ({
  getNotifications: () => {
    dispatch(fetchNotifications());
  },
  onNotificationPress: notification => () => {
    dispatch(markAsRead(notification));

    if (notification.action) {
      dispatch(notification.action);
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('NotificationsListScreen'))(NotificationsList),
);
