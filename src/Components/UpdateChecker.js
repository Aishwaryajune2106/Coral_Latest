import React, { useEffect } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import VersionCheck from 'react-native-version-check';

const UpdateChecker = () => {
  useEffect(() => {
    const checkForUpdate = async () => {
      try {
        const latestVersion = await VersionCheck.getLatestVersion({
          packageName: 'com.corallatest',
        });
        const currentVersion = VersionCheck.getCurrentVersion();

        const updateNeeded = await VersionCheck.needUpdate({
          currentVersion,
          latestVersion,
        });

        if (updateNeeded?.isNeeded) {
          Alert.alert(
            'Update Available',
            'A new version of the app is available. Please update to continue.',
            [
              {
                text: 'Update Now',
                onPress: () => {
                  Linking.openURL(
                    'https://play.google.com/store/apps/details?id=com.corallatest'
                  );
                },
              },
            ],
            { cancelable: false }
          );
        }
      } catch (error) {
        console.warn('Version check failed', error);
      }
    };

    checkForUpdate();
  }, []);

  return null;
};

export default UpdateChecker;
