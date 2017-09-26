import codePush from 'react-native-code-push';
import { Alert } from 'react-native';
/**
 * Calls Code Push sync method to synchronize app package with changes
 * deployed on Code Push identified by provided deployment key
 * If deployment key is not provided, the one from app's binary would be used
 * @param deploymentKey {String} codePush deploymentKey with which app should be synchronized
 * @param showUpdateDialog (optional) {Object || Boolean} determine should app user be warned
 * about app update (not recommended to do on iOS)
 */
export function syncPackage(deploymentKey, showUpdateDialog) {
  codePush.allowRestart();
  codePush.checkForUpdate(deploymentKey)
    .then((remotePackage) => {
      if (remotePackage) {
        remotePackage.download()
          .then((localPackage) => {
            if (showUpdateDialog) {
              Alert.alert(
                'New Content',
                'New content is available in the app, would you like to load it now?',
                [
                  {
                    text: 'Later',
                    onPress: () => localPackage.install(codePush.InstallMode.ON_NEXT_RESTART),
                  },
                  {
                    text: 'Yes',
                    onPress: () => localPackage.install(codePush.InstallMode.IMMEDIATE),
                  },
                ]
              );
            } else {
              localPackage.install(codePush.InstallMode.IMMEDIATE);
            }
          });
      }
    });
}
