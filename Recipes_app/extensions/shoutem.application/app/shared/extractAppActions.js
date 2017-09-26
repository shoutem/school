export function extractAppActions(app, appActionsRef) {
  const extensions = app.getExtensions();
  Object.keys(extensions).forEach(extensionName => {
    const extension = extensions[extensionName];
    if (extension.actions) {
      Object.keys(extension.actions).forEach(actionName => {
        const action = extension.actions[actionName];
        const key = `${extensionName}.${actionName}`;
        // Mutating appActions from application/index.js
        // eslint-disable-next-line no-param-reassign
        appActionsRef[key] = action;
      });
    }
  });
}
