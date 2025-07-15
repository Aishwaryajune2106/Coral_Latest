import {View, Text, SafeAreaView, Platform} from 'react-native';
import React, {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';

import Routes from './src/Routes/Routes';
import {CountryProvider} from './src/Context/CountryContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppStrings from './src/Constants/AppStrings';
import DeviceInfo from 'react-native-device-info';
import {StripeProvider} from '@stripe/stripe-react-native';
import {Linking} from 'react-native';
import { Alert } from 'react-native';

const App = () => {
  useEffect(() => {
    checkPermission();
    checkAppUpdate(); // 👈 Call update checker
    checkNotifications();
  }, []);

  const checkAppUpdate = async () => {
    try {
      const latestVersion = await VersionCheck.getLatestVersion();
      const currentVersion = await VersionCheck.getCurrentVersion();

      console.log('Latest:', latestVersion, '| Current:', currentVersion);

      const isNeeded = VersionCheck.needUpdate({currentVersion, latestVersion});
      if (isNeeded?.isNeeded) {
        const storeUrl = await VersionCheck.getStoreUrl();
        Alert.alert(
          'Update Available',
          'A new version of the app is available. Please update to continue.',
          [
            {
              text: 'Update',
              onPress: () => {
                Linking.openURL(storeUrl);
              },
            },
            {
              text: 'Later',
              style: 'cancel',
            },
          ],
          {cancelable: false},
        );
      }
    } catch (error) {
      console.log('Update check failed:', error);
    }
  };

  const checkNotifications = () => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('remoteMessagebg', remoteMessage);
      handleNotification(remoteMessage);
    });
    messaging().onMessage(async remoteMessage => {
      console.log('remoteMessage', remoteMessage);

      handleNotification(remoteMessage);
    });
  };

  const checkPermission = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
        await getToken();
      } else {
        console.log('No enabled');
        await requestPermission();
        await getToken();
      }
    } catch (error) {
      console.error('Error in checkPermission:', error);
    }
  };

  const getToken = async () => {
    try {
      //await messaging().registerDeviceForRemoteMessages();
      let fcmToken = await messaging().getToken();
      console.log('FCM Token:', fcmToken);

      if (fcmToken) {
        console.log(`fcmToken: ${Platform.OS} ${fcmToken}`);
        await AsyncStorage.setItem(AppStrings.DEVICE_TOKEN, fcmToken);
      } else {
        console.log('FCM token is null');
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
    }
  };
  const requestPermission = async () => {
    try {
      await messaging().requestPermission();
      getToken();
    } catch (error) {
      console.log('Rejected');
    }
  };

  const handleNotification = async data => {
    console.log(data, 'data notif');
    // Request permissions (required for iOS)

    // Create a channel (required for Android)
    await notifee.cancelAllNotifications();
    const channelId = await notifee.createChannel({
      id: 'Defult',
      name: 'Defult 1',
      importance: AndroidImportance.HIGH,
      sound: 'Defult',
    });
    // Display a notification

    await notifee.displayNotification({
      title: data?.notification?.title,
      // subtitle: data.body,
      body: data?.notification?.body,
      android: {
        channelId,
        color: '#EED3E9',
        sound: 'Defult',
      },
      ios: {
        channelId,
        sound: 'Defult',
      },
    });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Toast ref={ref => Toast.setRef(ref)} />
      <CountryProvider>
        <StripeProvider publishableKey="pk_test_51QTPFIFEOzMlpKTYkjydHPTAlSkb0kZOjy2iVb3lopcC4XYuNIyl73cUb3Xgx7xqwkrKGnC7owYjJ7r6Ir2xO9NA00JmTgn6Be">
          <Routes />
        </StripeProvider>
        {/* <SaveNominee /> */}
      </CountryProvider>
    </SafeAreaView>
  );
};

export default App;
