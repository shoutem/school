import { getFirstShortcut } from 'shoutem.application';

/**
 * Root screen represents first screen in the application, usually main navigation screen.
 * @param state
 * @param ownProps
 * @returns {{isRootScreen: boolean}}
 */
export default function (state, ownProps) {
  return {
    isRootScreen: getFirstShortcut(state) === ownProps.shortcut,
  };
}
