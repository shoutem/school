# Shoutem Analytics Interface

## Action types
- SCREEN_VIEW
    Action is triggered **automatically** every time user navigates to new screen.
```javascript
     @property type {string} Redux action type
     @property title {string} Event category
     @property payload {object} Additional data
```
- EVENT
    This actions are triggered manually on wanted events.
```javascript
     @property type {string} Redux action type
     @property resource {string} Resource on which action is performed
     @property action {string} The type of interaction
     @property payload {object} Additional data
```

### Additional actions data (payload)
This data is injected to analytics action by other extensions.
Your extension can also injected additional data, see "Extending analytics actions".
- Application payload
    Added to every analytics action.
```javascript
     @property screen {string} Current screen canonical name
     @property shortcut {object} Current shortcut
     @property appId {number}
```
- Event payload
    Suggested event specific payload properties.
    Use this properties either when creating or recording event.
    This standard makes it more easier for all to know what to expect,
    for the purpose of providing more concise data to analytics.
```javascript
     // Content related Event
     @property title {string} Event {@property resource} title
```


## Extending analytics actions
Use Redux middleware to extend analytics action with additional data.
To be certain that action is going to be extended **before** action is read, 
set priority to your middleware to `ANALYTICS_MIDDLEWARE_PRIORITY`.
```javascript
import { isAnalyticsAction } from 'shoutem.analytics';
const injectApplicationDataToAnalyticsAction = store => next => action => {
  // isAnalyticsAction - helper, it will return true for every analytics action
  if (isAnalyticsAction(action)) {
    // eslint-disable-next-line no-param-reassign
    action = {
      ...action,
      ...getApplicationAnalyticsData(store),
    };
  }
  return next(action);
};
setPriority(injectApplicationDataToAnalyticsAction, ANALYTICS_MIDDLEWARE_PRIORITY);
```

## Getting data from actions
Use Redux middleware to get data from analytics action.
To be certain that action is going to be intercepted **after** action extened with additional data,
set priority to your middleware to `ANALYTICS_OUT_MIDDLEWARE_PRIORITY`.
```javascript
// Basic example, creating your own redux middleware
import { SCREEN_VIEW, isScreenView } from 'shoutem.anaytics';
const trackScreenView = store => next => action => {
  if (action.type === SCREEN_VIEW || isScreenView(action)) {
    const screenName = action.title || action.screen;
    googleAnalytics.trackScreenView(screenName);
  }
  // Make sure you keep the middleware chain going
  return next(action);
};
setPriority(trackScreenView, ANALYTICS_OUT_MIDDLEWARE_PRIORITY);

// Using our middleware creators to intercept only wanted data
function trackScreenView(action, store) {
  const screenName = action.title || action.screen;
  const customDimensions = createCustomDimensions(action);
  googleAnalytics.trackScreenViewWithCustomDimensionValues(screenName, customDimensions);
}
setPriority(trackScreenView, ANALYTICS_OUT_MIDDLEWARE_PRIORITY);

function trackEvents(action, store) {
  const customDimensions = createCustomDimensions(action);
  googleAnalytics.trackEventWithCustomDimensionValues(
    action.resource,
    action.action,
    undefined,
    customDimensions
  );
}
setPriority(trackEvents, ANALYTICS_OUT_MIDDLEWARE_PRIORITY);

export default [createScreenViewMiddleware(trackScreenView), createEventsMiddleware(trackEvents)];
```
