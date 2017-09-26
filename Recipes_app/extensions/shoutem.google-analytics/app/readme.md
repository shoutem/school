# Shoutem Google Analytics
Main use is to format Shoutem analytics for Google Analytics and pass formatted data to registered Trackers.

## Google Analytics Service
Default instance is exported as `googleAnalytics` and it formats Shoutem analytics to match Google Analytics.
All registered trackers to this instace will receive same data.
```javascript
import { googleAnalytics } from 'shoutem.google-analytics';
const trackerConfig = {
    trackerId: 'UA-xxxx-1',
    // Used in most advanced scenarios
    sampleRate: 50, // Percentage 0 - 100
    customDimensionsFieldIndexMap: {
      dimensionFieldName: dimensionsFieldIndex,
    },
};
// You can use this tracker to record any speficic data for it
const tracker = googleAnalytics.createAndAddTracker(trackerConfig);
```

### Advance configuration
- sampleRate
    Reduce recorded tracker data for given percentage
- customDimensionsFieldIndexMap
    Describe your tracker Custom Dimensions filed:index relationships. 
    Google Analytics records custom dimensions by index and not by field name.
    To avoid this transformation all the time, you can provide customDimensionsFieldIndexMap {fieldName: fieldIndex},
    and when calling tracker methods with `customDimensions` you can simply name dimensions keys as they are in Google Analytics.


## Creating custom Google Analytics Service (group)
If you want your data to be formatted differently then default `googleAnalytics` service does,
you can use `GoogleAnalyticsService` class to create new service instance, create your own analytics middleware and 
use newly created instance to pass data to Google Analytics. Of course, do not forget to register trackers!
