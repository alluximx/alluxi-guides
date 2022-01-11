import React from 'react';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
// Services
import fcmService from '../../services/fcm-service';
import {useNavigation} from '@react-navigation/native';
import {Linking} from 'react-native';

const useFCM = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = React.useState(true);
  const [initialRoute, setInitialRoute] = React.useState('Home');

  /***************
   *** Effects ***
   ***************/

  React.useEffect(() => {
    // Register firebase on init.
    (async () => await fcmService.getToken())();

    // Define message handler when receiving notifications.
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      // Create a channel
      const channelId = await notifee.createChannel({
        id: 'dog-it-default-notification-channel',
        name: 'Default Channel',
        importance: AndroidImportance.DEFAULT,
      });

      // Display a notification
      await notifee.displayNotification({
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        android: {
          channelId,
          color: '#13b048',
          smallIcon: 'ic_notification',
          sound: 'default',
        },
        data: remoteMessage.data,
        remote: true,
      });
    });

    notifee.onForegroundEvent(({type, detail}) => {
      if (type === EventType.PRESS) {
        if (detail.notification?.data?.link) {
          Linking.openURL(detail.notification.data.link);
        }
      }
    });

    // Define message handler when opening notification from
    // background state.
    messaging().onNotificationOpenedApp((remoteMessage) => {
      if (remoteMessage?.data) {
        const link: string = remoteMessage.data.link;
        if (link) {
          Linking.openURL(link);
        }
      }
    });

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage?.data) {
          const link: string = remoteMessage.data.link;
          if (link) {
            Linking.openURL(link); // e.g. "Settings"
          }
        }
      });

    return unsubscribe;
  }, []);

  return {
    loading,
    initialRoute,
  };
};

export default useFCM;
