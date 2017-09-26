import _ from 'lodash';

export default event => (event && _.has(event, 'location.latitude') && _.has(event, 'location.longitude'));
