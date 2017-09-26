import { getExtensionSettings } from 'shoutem.application';
import { ext } from '../const';

export default function (state) {
  const settings = getExtensionSettings(state, ext());
  return {
    navigationBarImage: settings.backgroundImage,
    backgroundImageEnabledFirstScreen: settings.backgroundImageEnabledFirstScreen,
    showTitle: settings.showTitle,
  };
}
