import React from "react";
import messaging, {
	FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import notifee, { EventType } from "@notifee/react-native";
// Services
import fcmService from "../services/fcm-service";

const useFCM = (
	onMessage: (
		remoteMessage: FirebaseMessagingTypes.RemoteMessage
	) => Promise<void>,
	onOpenNotification: (
		remoteMessage: FirebaseMessagingTypes.RemoteMessage
	) => void
) => {
	React.useEffect(() => {
		// Register firebase on init.
		(async () => await fcmService.getToken())();
		// Define message handler when receiving notifications.
		const unsubscribe = messaging().onMessage(onMessage);
		// Triggered when opening notification from Foreground state.
		notifee.onForegroundEvent(({ type, detail }) => {
			if (type === EventType.PRESS) {
				onOpenNotification(detail.notification);
			}
		});
		// Triggered when opening notification from Background state.
		messaging().onNotificationOpenedApp(onOpenNotification);
		// Triggered when opening the notification from Killed State.
		messaging().getInitialNotification().then(onOpenNotification);

		return unsubscribe;
	}, []);

	return messaging;
};

export default useFCM;
