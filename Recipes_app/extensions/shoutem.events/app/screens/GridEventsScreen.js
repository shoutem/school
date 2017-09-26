import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { cloneStatus } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { GridRow, View } from '@shoutem/ui';

import { currentLocation } from 'shoutem.cms';

import { ext } from '../const';
import GridEventView from '../components/GridEventView';
import { mapDispatchToProps, mapStateToProps, EventsScreen } from './EventsScreen';

export class GridEventsScreen extends EventsScreen {
  static propTypes = {
    ...EventsScreen.propTypes,
  };

  getNavBarProps() {
    return super.getNavBarProps('Grid');
  }

  renderRow(events, sectionId, eventId) {
    const { hasFeaturedItem } = this.props;

    if (hasFeaturedItem && eventId === '0') {
      return this.renderFeaturedEvent(events[0]);
    }

    const eventsViews = _.map(events, event => (
      <GridEventView
        key={event.id}
        event={event}
        onPress={this.openDetailsScreen}
        action={this.addToCalendar}
      />
    ));

    return (
      <View styleName="flexible sm-gutter-bottom">
        <GridRow columns={2}>
          {eventsViews}
        </GridRow>
      </View>
    );
  }

  /**
   * Override CMSListScreen renderData to provide data grouped into rows.
   * @param events
   * @returns {*}
   */
  renderData(events) {
    const { shouldRenderMap } = this.state;
    const { hasFeaturedItem } = this.props;
    if (shouldRenderMap) {
      return this.renderEventsMap(events);
    }
    let featured = hasFeaturedItem;
    const groupedEvents = GridRow.groupByRows(events, 2, () => {
      if (featured) {
        featured = false;
        return 2;
      }
      return 1;
    });

    cloneStatus(events, groupedEvents);

    return super.renderData(groupedEvents);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('GridEventsScreen'))(currentLocation(GridEventsScreen)),
);
