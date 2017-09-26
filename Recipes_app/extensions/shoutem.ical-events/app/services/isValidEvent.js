import _ from 'lodash';

export default event => (event && _.has(event, 'geo.lat') && _.has(event, 'geo.lon'));
