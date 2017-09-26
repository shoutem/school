import { AsyncStorage } from 'react-native';
import { toSerializableFormat, fromSerializableFormat } from '@shoutem/redux-io/serialization';
import { persistStore, createTransform, autoRehydrate } from 'redux-persist';

let storePersistor;

export function purgeStore() {
  if (storePersistor) {
    return storePersistor.purge();
  }

  return Promise.reject(
    'Trying to purge a store that has not yet been created. ' +
    'Disabling store rehydration is not available at the moment.'
  );
}

/**
 * Persisting store with configured settings.
 * Resolves Shoutem specific settings before persisting store.
 * @param store
 * @param reducers
 * @returns {*}
 */
const persistStoreEnhancer = createStore => (...args) => {
  const store = createStore(...args);
  storePersistor = persistStore(
    store,
    {
      storage: AsyncStorage, // Use RN storage system
      transforms: [createTransform(toSerializableFormat, fromSerializableFormat)],
    }
  );
  return store;
};

export default [persistStoreEnhancer, autoRehydrate()];
