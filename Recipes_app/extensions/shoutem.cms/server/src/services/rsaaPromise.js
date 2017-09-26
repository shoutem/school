const rsaaPromise = action => dispatch => (
  new Promise((resolve, reject) => (
    dispatch(action).then(resolvedAction => {
      if (resolvedAction.error) {
        reject(resolvedAction);
        return;
      }
      resolve(resolvedAction);
    }, reject)
  ))
);

export default rsaaPromise;
