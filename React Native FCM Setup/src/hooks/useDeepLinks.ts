/**
 * This file contains a hook which receives some params
 * to use the deep links and navigate the user with
 * the provided configuration when opening them.
 */

import React from "react";
import { Linking } from "react-native";

const useDeepLinks = (prefixes: string[], screensConfig: any) => {
	const linking = {
		prefixes: prefixes,
		config: screensConfig,

		// Custom function to get the URL which was used to open the app
		async getInitialURL() {
			// First, you may want to do the default deep link handling
			// Check if app was opened from a deep link
			const url = await Linking.getInitialURL();

			if (url != null) {
				return url;
			}
		},

		// Custom function to subscribe to incoming links
		subscribe(listener: (url: string) => void) {
			// First, you may want to do the default deep link handling
			const onReceiveURL = ({ url }: { url: string }) => listener(url);

			// Listen to incoming links from deep linking
			Linking.addEventListener("url", onReceiveURL);

			return () => {
				// Clean up the event listeners
				Linking.removeEventListener("url", onReceiveURL);
			};
		},
	};
	return linking;
};

export default useDeepLinks;
