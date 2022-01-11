/**
 * This file contains some helper functions for the FCM
 * configuration.
 *
 * Feel free to modify it as you need.
 */

import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";

class FCMService {
	getToken = async () => {
		let fcmToken = await AsyncStorage.getItem("fcmToken");
		if (!fcmToken) {
			fcmToken = await messaging().getToken();
			if (fcmToken) {
				await AsyncStorage.setItem("fcmToken", fcmToken);
			}
		}
		console.info("fcm-token", fcmToken);

		return fcmToken;
	};

	requestPermission = async () =>
		messaging()
			.requestPermission()
			.then(() => {
				this.getToken();
			})
			.catch((error) => {
				console.warn(`${error} permission rejected`);
			});

	checkPermission = async () => {
		const enabled = await messaging().hasPermission();
		if (enabled) {
			this.getToken();
		} else {
			this.requestPermission();
		}
	};
}

const fcmService = new FCMService();
export default fcmService;
