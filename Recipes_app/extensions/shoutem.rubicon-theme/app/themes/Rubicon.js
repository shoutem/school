import {
  Platform,
  StyleSheet,
  TouchableNativeFeedback,
} from 'react-native';
import NavigationExperimental from 'react-native-navigation-experimental-compat';
import _ from 'lodash';

import {
  getTheme,
  defaultThemeVariables as defaultUiThemeVariables,
  dimensionRelativeToIphone,
} from '@shoutem/ui';

import {
  INCLUDE,
  changeColorAlpha,
} from '@shoutem/theme';

const NAVIGATION_BAR_HEIGHT = NavigationExperimental.Header.HEIGHT;

export const defaultThemeVariables = {
  ...defaultUiThemeVariables,

  // Horizontal gutter is calculated to have 24px margin between every ICON and screen edge.
  gridItemHorizontalGutter: 17,
  gridItemVerticalGutter: 24,
};

export default (customVariables = {}) => {
  const variables = {
    ...defaultThemeVariables,
    ...customVariables,
  };

  return _.merge({}, getTheme(variables), {

    // Html
    'shoutem.ui.Html': {
      a: {
        text: {
          fontWeight: '700',
          color: customVariables.titleColor,
        },
      },
      'se-attachment': {
        gallery: {
          container: {
            height: dimensionRelativeToIphone(130),
          },
        },
        video: {
          container: {
            width: 300,
          },
        },
      },
    },

    clearNavigationBar: {
      'shoutem.ui.Title': {
        // We have a problem with animations attaching too late
        // during initial screen render, temporary workaround is to
        // hide the title initially.
        color: 'transparent',
      },
    },

    //
    // Navigation
    // Drawer, TabBar, Sub-navigation

    mainNavigation: {
      '.selected': {
        // TouchableOpacity component
        // "Item" represent generic name for navigation action components
        // TabBarItem -> Button; Drawer -> Row; IconGrid -> Cell
        item: {
          backgroundColor: variables.mainNavSelectedItemBackground,
        },
        icon: {
          tintColor: variables.mainNavSelectedItemColor,
        },
        text: {
          color: variables.mainNavSelectedItemColor,
        },
      },
      item: {
        backgroundColor: variables.mainNavItemBackground,
      },
      icon: {
        tintColor: variables.mainNavItemColor,
      },
      text: {
        color: variables.mainNavItemColor,
      },
    },
    subNavigation: {
      '.main-navigation': {
        // Active when the IconGrid or List layout is on root screen (in app's main navigation)
        [INCLUDE]: ['mainNavigation'],
      },
      '.text-hidden': {},
      '.small-icon': {
        icon: {
          width: 24,
          height: 24,
        },
      },
      '.medium-icon': {
        icon: {
          width: 36,
          height: 36,
        },
      },
      '.large-icon': {
        icon: {
          width: 48,
          height: 48,
        },
      },
      '.extraLarge-icon': {
        icon: {
          width: 60,
          height: 60,
        },
      },

      page: {
        [INCLUDE]: ['alignmentVariants'],
      },

      item: {
        backgroundColor: variables.subNavItemBackground,
      },

      icon: {
        tintColor: variables.subNavItemColor,
      },

      text: {
        color: variables.subNavItemColor,
      },

      scrollView: {
        flex: 1,
        alignSelf: 'stretch',
      },
      // Only available when screen has background image
      backgroundWrapper: {
        flex: 1,
        alignSelf: 'stretch',
        'shoutem.ui.Image': {
          [INCLUDE]: ['fillParent'],
        },
      },
    },
    'shoutem.navigation.TabBar': {
      screen: {
        // TabBar container
        'shoutem.ui.View': {
          position: 'absolute',
          borderTopWidth: 1,
          borderColor: variables.mainNavBorderColor,
          backgroundColor: variables.mainNavBackground,
          bottom: 0,
          left: 0,
          right: 0,
        },
        paddingBottom: 60, // TabBar height
      },
    },
    'shoutem.navigation.TabBarItem': {
      [INCLUDE]: ['mainNavigation'],
      '.icon-and-text': {
        icon: {
          marginTop: 8,
        },
        text: {
          marginBottom: 8,
          fontSize: 10,
        },
      },
      '.icon-only': {
        item: {
          justifyContent: 'center',
        },
      },
      '.text-only': {
        text: {
          fontSize: 15,
        },
        item: {
          justifyContent: 'center',
        },
      },
      '.selected': {
        item: {
          borderColor: variables.mainNavSelectedItemBorderColor,
        },
      },
      item: {
        height: 60,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 0,
        borderBottomWidth: 2,
        borderRadius: 0,
        paddingHorizontal: variables.smallGutter,
        borderColor: 'transparent',
        touchableOpacity: {
          activeOpacity: 0.5,
        },
        touchableNativeFeedback: {
          background: Platform.OS === 'android' && (
            // Ripple effect is not supported on older Android versions and crashes the app
            Platform.Version >= 21 ?
              TouchableNativeFeedback.Ripple(changeColorAlpha(variables.mainNavItemColor, 0.3)) :
              TouchableNativeFeedback.SelectableBackground()
          ),
        },
      },
      icon: {
        height: 24,
        padding: 12,
        width: null,
        flex: 0,
        resizeMode: 'contain',
      },
      text: {
        fontWeight: 'normal',
        flex: -1,
        margin: 0,
      },
    },
    'shoutem.navigation.Drawer': {
      menu: {
        // container
        paddingTop: NAVIGATION_BAR_HEIGHT,
        backgroundColor: variables.mainNavBackground,
      },
      underlayScreensWrapper: {
        marginLeft: -1,
        borderLeftWidth: 1,
        borderColor: variables.mainNavBorderColor,
      },
      screenStack: {
        cardStack: {
          shadowColor: 'rgba(0, 0, 0, 0.12)',
          shadowOpacity: 1,
          shadowRadius: 12,
        },
        card: {
          shadowOpacity: 0,
        },
      },
      // Width of visible content when menu is opened
      visibleContentWidth: 54,
    },
    'shoutem.navigation.DrawerItem': {
      [INCLUDE]: ['mainNavigation'],
      item: {
        height: 64,
        marginBottom: variables.mediumGutter,
        padding: 0,
        borderWidth: 0,
        borderRadius: 0,
        alignItems: 'center',
        justifyContent: 'flex-start',
        alignSelf: 'stretch',
        flexDirection: 'row',
        paddingLeft: variables.largeGutter,
        paddingRight: variables.smallGutter * 2,
        touchableOpacity: {
          activeOpacity: 0.5,
        },
        touchableNativeFeedback: {
          background: Platform.OS === 'android' && (
            // Ripple effect is not supported on older Android versions and crashes the app
            Platform.Version >= 21 ?
              TouchableNativeFeedback.Ripple(changeColorAlpha(variables.mainNavItemColor, 0.2)) :
              TouchableNativeFeedback.SelectableBackground()
          ),
        },
      },
      icon: {
        height: 24,
        padding: 12,
        width: null,
        flex: 0,
        resizeMode: 'contain',
        marginRight: variables.largeGutter,
      },
      text: {
        justifyContent: 'flex-start',
        margin: 0,
        fontSize: 15,
      },
    },
    'shoutem.navigation.IconGrid': {
      [INCLUDE]: ['subNavigation'],
      '.text-hidden': {
        item: {
          marginBottom: variables.gridItemVerticalGutter,
        },
      },

      '.comfortable': {
        page: {
          paddingTop: 48,
        },
        row: {
          paddingRight: 48,
        },
        '.2-rows': {
          item: {
            marginBottom: 24,
          },
        },
        '.3-rows': {
          item: {
            marginBottom: 24,
          },
        },
        '.4-rows': {
          item: {
            marginBottom: 24,
          },
        },
        '.5-rows': {
          item: {
            marginBottom: 12,
          },
        },
        '.6-rows': {
          page: {
            paddingTop: variables.gridItemVerticalGutter,
          },
          row: {
            paddingRight: variables.gridItemHorizontalGutter,
          },
        },
        '.2-columns': {
          item: {
            marginLeft: 48,
          },
        },
        '.3-columns': {
          item: {
            marginLeft: 36,
          },
        },
        '.4-columns': {
          page: {
            paddingTop: variables.gridItemVerticalGutter,
          },
          row: {
            paddingRight: variables.gridItemHorizontalGutter,
          },
        },

        '.extraLarge-icon': {
          text: {
            marginBottom: 6,
            marginTop: 6,
          },
        },
      },

      page: {
        paddingTop: variables.gridItemVerticalGutter,
        // Compensate 2px that left on the row side. Row calculated with in IconGrid is 373.
        paddingHorizontal: 1,
      },
      row: {
        // Row width is calculated by adding up margin and width of all items in the row.
        // Number of columns is used as number of items in the row.

        '.left-alignment': {
          // If Grid is aligned to the left (gridAlignment = topLeft || middleLeft || bottomLeft)
          // Row content should also start from left.
          // DEFAULT is Left alignment
        },
        '.center-alignment': {
          // If Grid is is aligned to the center
          // (gridAlignment = topCenter || middleCenter || bottomCenter)
          // Same as left-alignment
        },
        '.right-alignment': {
          // If Grid is is aligned to right (gridAlignment = topRight || middleRight || bottomRight)
          // Row content should also start from right.
          justifyContent: 'flex-end',
        },
        paddingRight: variables.gridItemHorizontalGutter, // Used to calculate row width
        flexDirection: 'row',
      },
      item: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        width: 72, // Used to calculate row width
        marginLeft: variables.gridItemHorizontalGutter, // Used to calculate row width
        marginBottom: 0,
        height: null, // to stretch item height by its content
      },
      iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 64,
        height: 64,
      },
      icon: {
      },

      text: {
        fontSize: 10,
        marginBottom: 12,
        height: 12,
        lineHeight: 12,
        maxWidth: 72,
        flex: -1,
      },
    },
    'shoutem.navigation.List': {
      [INCLUDE]: ['subNavigation'],
      '.main-navigation': {
        item: {
          borderColor: variables.mainNavBorderColor,
        },
        chevron: {
          color: changeColorAlpha(variables.mainNavItemColor, 0.5),
        },
      },
      // In item alignments, set on builder
      '.in-item-alignment-left': {
        iconAndTextContainer: {
          justifyContent: 'flex-start',
        },
      },
      '.in-item-alignment-center': {
        iconAndTextContainer: {
          justifyContent: 'center',
        },
      },
      '.in-item-alignment-right': {
        iconAndTextContainer: {
          justifyContent: 'flex-end',
          paddingRight: variables.mediumGutter,
        },
      },
      '.large-icon': {
        item: {
          height: 80,
        },
      },
      '.text-hidden': {},

      '.icon-hidden': {
        iconAndTextContainer: {
          paddingLeft: 0,
        },
      },

      page: {
        flexDirection: 'column',
      },
      item: {
        alignItems: 'center',
        flexDirection: 'row',
        borderTopWidth: 1,
        borderColor: variables.subNavListBorderColor,
        height: 65,
      },
      iconAndTextContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        flex: 1,
        paddingLeft: variables.mediumGutter,
      },
      icon: {
        flex: 0,
      },
      text: {
        fontSize: 15,
        marginLeft: variables.mediumGutter,
      },
      chevronContainer: {
        marginRight: 7,
        height: 24,
        width: 24,
        justifyContent: 'center',
        alignItems: 'center',
      },
      chevron: {
        color: changeColorAlpha(variables.subNavItemColor, 0.5),
      },
    },

    'shoutem.navigation.CardList': {
      page: {
        // Page padding bottom is defined by item marginBottom
        '.small-gutter': {
          paddingTop: 8,
          paddingHorizontal: 8,
        },
        '.medium-gutter': {
          paddingTop: 16,
          paddingHorizontal: 16,
        },
        '.large-gutter': {
          paddingTop: 24,
          paddingHorizontal: 24,
        },
        '.full-width': {
          paddingHorizontal: 0,
        },
        '.no-gutter': {},
        flexDirection: 'column',
      },
      item: {
        [INCLUDE]: ['alignmentVariants'],
        // Related with page gutter
        '.small-gutter': {
          marginBottom: 8,
        },
        '.medium-gutter': {
          marginBottom: 16,
        },
        '.large-gutter': {
          marginBottom: 24,
        },
        '.no-gutter': {},
        // Represents height/pageWidth ratio
        heights: {
          small: 0.33,
          medium: 0.5,
          large: 0.625,
        },
        backgroundColor: variables.subNavItemBackground,
      },
      text: {
        flex: 0,
        width: null,
        fontSize: 15,
        marginLeft: variables.mediumGutter,
        color: variables.subNavItemColor,
      },
    },

    //
    // Empty State (error page)
    //
    'shoutem.ui.EmptyStateView': {
      'shoutem.ui.View': {
        'shoutem.ui.Subtitle': {
          marginTop: variables.mediumGutter,
          width: 120,
        },

        'shoutem.ui.View': {
          '.anchor-bottom': {
            position: 'absolute',
            bottom: 0,
          },

          '.icon-placeholder': {
            height: 62,
            width: 62,
            backgroundColor: 'rgba(3, 3, 3, 0.1)',
            borderRadius: 31,
            justifyContent: 'center',
          },
        },
      },
    },

    //
    // WebView
    //
    'shoutem.webview.NavigationToolbar': {
      'shoutem.ui.View': {
        '.container': {
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: 56,
          backgroundColor: '#eeeeee',
          borderTopColor: 'rgba(20, 20, 20, 0.2)',
          borderTopWidth: StyleSheet.hairlineWidth,
        },

        'shoutem.ui.View': {
          '.navigation-buttons': {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: 140,
          },

          'shoutem.ui.Button': {
            'shoutem.ui.Icon': {
              '.disabled': {
                color: '#a6a6a6',
              },

              color: '#5f5f5f',
            },
          },
        },
      },
    },

    //
    // Photos
    //
    'shoutem.photos.PhotosGrid': {
      list: {
        listContent: {
          padding: variables.mediumGutter,
        },
      },
    },
    'shoutem.rss-photos.PhotosGrid': {
      list: {
        listContent: {
          padding: variables.mediumGutter,
        },
      },
    },

    // Camera
    'shoutem.camera.QRCodeScanner': {
      cameraContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      cameraFocusFrame: {
        // TODO: Reimplement this with relative sizes and test on multiple devices
        width: 175,
        height: 165,
        resizeMode: 'contain',
      },
      cameraView: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
      noPermissionsMessage: {
        alignSelf: 'center',
        fontSize: 18,
        lineHeight: 20,
      },
    },
  });
};
