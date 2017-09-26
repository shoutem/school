import { REHYDRATE } from 'redux-persist/constants';
import createActionBuffer from 'redux-action-buffer';

// Action Buffer prevents actions executions before rehydration
export default [createActionBuffer(REHYDRATE)];
