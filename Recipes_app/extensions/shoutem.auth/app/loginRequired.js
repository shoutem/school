// function that decorates given Screen with loginRequired property
// Screen decorated with that property should first open LoginScreen if user isn't logged in
export function loginRequired(Screen, value = true) {
  // eslint-disable-next-line no-param-reassign
  Screen.loginRequired = value;
  return Screen;
}
