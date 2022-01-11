# React Native FCM Configuration for Push Notifications in Android & iOS

This is a guide to setup FCM Push notifications in a `bare` React Native project. If you are using Expo and you find any trouble while following the guide, please refer to the documentation links found in the [References](#references) section and follow the required steps for Expo.

We'll be using Firebase's FCM service together with the following libraries to display local and push notifications:

- React Navigation
- React Native Firebase
- Notifee
- uri-scheme
- React native async storage

## Prerequisites

### Android

- Install or update [Android Studio](https://developer.android.com/sdk) to its latest version.

- Make sure that your project meets these requirements:

  - Targets API level 19 (KitKat) or higher
  - Uses Android 4.4 or higher
  - Uses [Jetpack (AndroidX)](https://developer.android.com/jetpack/androidx/migrate), which includes meeting these version requirements:
    - `com.android.tools.build:gradle` v3.2.1 or later
    - `compileSdkVersion` 28 or later

- Set up a physical device or use an [emulator](https://developer.android.com/studio/run/managing-avds) to run your app.

### iOS

- Xcode 12.5 or later
- Make sure that your project meets these requirements:

  - Your project must target these platform versions or later:
    - iOS 10
    - macOS 10.12
    - tvOS 12
    - watchOS 6

## Installation

#### React Native Firebase

```powershell
# Install & setup the app module
yarn add @react-native-firebase/app

# Install the messaging module
yarn add @react-native-firebase/messaging

# If you're developing your app using iOS, run this command
cd ios/ && pod install
```

#### Notifee

```powershell
yarn add @notifee/react-native
```

#### uri-scheme

```powershell
yarn add uri-scheme
```

#### Async storage

```powershell
yarn add @react-native-async-storage/async-storage
```

#### React Navigation

If you don't have react-navigation already in your poject, please follow the steps as shown in their docs: https://reactnavigation.org/docs/getting-started/

#### Note on Autolinking with React Native

Users on React Native 0.60+ automatically have access to "autolinking", requiring no further manual installation steps. To automatically link the package, rebuild your project:

```powershell
# For iOS
cd ios/ && pod install --repo-update
npx react-native run-ios

# For Android
npx react-native run-android
```

If you're using an older version of React Native without autolinking support, or wish to integrate into an existing project, you should review the steps for each of the previous installed libraries their respective [documentation](#references).

### Firebase

First we'll need a Firebase project. If you don't have one already, [create one](https://console.firebase.google.com/). You can [sign into Firebase](https://console.firebase.google.com/) using your Google account.

Then we'll need to create an Android and iOS app on our Firebase project.

#### Android

1. Click the "Add app" button and select the Android Icon to launch the setup workflow.
2. Fill the required fields for the setup and click on "Next step".
3. Download the `google-services.json` file and open your RN project with Android Studio.
4. Add the file inside the `android/app` folder.

   ![](https://www.gstatic.com/mobilesdk/160426_mobilesdk/images/android_studio_project_panel@2x.png)
5. Go to `android/build.gradle` and add the following:

```kotlin
buildscript {
  repositories {
    // Check that you have the following line (if not, add it):
    google()  // Google's Maven repository

  }
  dependencies {
    ...
    // Add this line
    classpath 'com.google.gms:google-services:4.3.10'

  }
}

allprojects {
  ...
  repositories {
    // Check that you have the following line (if not, add it):
    google()  // Google's Maven repository

    // Notifee's Android library:
    maven {
      url "$rootDir/../node_modules/@notifee/react-native/android/libs"
    }

    // ... you will already have some local repositories defined ...

    ...
  }
}
```

5. Go to `android/app/build.gradle` and add the following:

```kotlin
apply plugin: 'com.android.application'

// Add this line
apply plugin: 'com.google.gms.google-services'


dependencies {
  // Import the Firebase BoM
  implementation platform('com.google.firebase:firebase-bom:29.0.3')

  // Add the FCM dependency
  implementation 'com.google.firebase:firebase-messaging'

  // If enabled, declare the dependency for the Firebase SDK for Google Analytics
  implementation 'com.google.firebase:firebase-analytics'
}
```

6. Finally, Sync the project with Gradle files by pressing "Sync now",

![](https://www.gstatic.com/mobilesdk/160330_mobilesdk/images/android_studio_gradle_changed_butterbar@2x.png)

or by using `File > Sync project with Gradle files` in Android Studio.

Now, we'll create  a new intent in the manifest for deep linking:  
  
```powershell
// Replace "myapp" with the name of your app.
npx uri-scheme add myapp --android
```

Now open your `AndroidManifest.xml` file and do the following:

1. Make sure `launchMode` of your `MainActivity` is set to `singleTask`.
2. Make sure there is an `intent-filter` inside the `MainActivity` with a `VIEW` type action, if not, add it:

```xml
<activity
    android:name=".MainActivity"
    android:launchMode="singleTask">
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="myapp" /> <!-- Replace "myapp" -->
    </intent-filter>
</activity>
```

Here, you'll have to replace with the name of your app where it says "myapp". This will be the same name used in the backend for navigating when opening a notification. 


### Customizing notifications icons in Android

Within the application component, you can add metadata elements to set a default notification icon and color.

```xml
<manifest xmlns:tools="http://schemas.android.com/tools">
  <application>
    <!-- ... -->
    <!-- Set custom default icon. This is used when no icon is set for incoming notification messages.
         See README(https://goo.gl/l4GJaQ) for more. -->
    <meta-data
        android:name="com.google.firebase.messaging.default_notification_icon"
        android:resource="@drawable/ic_stat_ic_notification" />
    <!-- Set color used with incoming notification messages. This is used when no color is set for the incoming
         notification message. See README(https://goo.gl/6BKBk7) for more. -->
    <meta-data
        android:name="com.google.firebase.messaging.default_notification_color"
        android:resource="@color/colorAccent" />
  </application>
</manifest>
```

#### iOS

1. Click the "Add app" button and select the Android Icon to launch the setup workflow.
2. The "iOS bundle ID" must match your local project bundle ID. The bundle ID can be found within the "General" tab when opening the project with Xcode.
3. Download the `GoogleService-Info.plist` file and open the .xcworkspace file inside the ios folder with Xcode.
4. Right click on the project name and "Add files" to the project, as demonstrated below:

![](https://images.prismic.io/invertase/717983c0-63ca-4b6b-adc5-31318422ab47_add-files-via-xcode.png?auto=format)

5. Select the downloaded GoogleService-Info.plist file from your computer, and ensure the "Copy items if needed" checkbox is enabled.

![](https://prismic-io.s3.amazonaws.com/invertase%2f7d37e0ce-3e79-468d-930c-b7dc7bc2e291_unknown+%282%29.png)

6. Open your AppDelegate.m file inside the ios folder, and add the following:

    - At the top of the file, import the Firebase SDK:
    
    ```swift
    #import <Firebase.h>
    #import <React/RCTLinkingManager.h>
    ```
    
    - Within your existing didFinishLaunchingWithOptions method, add the following to the top of the method:
    
    ```swift
    - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
      // Add me --- \/
      [FIRApp configure];
      // Add me --- /\
      // ...
    }
    ```
        
    - Above `@end` add the following:  
    ```swift
    - (BOOL)application:(UIApplication *)application
       openURL:(NSURL *)url
       options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
    {
      return [RCTLinkingManager application:application openURL:url options:options];
    }
    ```
7. Run the following command:  

```powershell
// replace "myapp" with the name of your app.
npx uri-scheme add myapp --ios
```

# Usage

Add the files found in the src folder of this repo to your project and do the following steps:

- In the file where you have your NavigationContainer, add the following:

```javascript
// Deep links configuration. Here you'll have to add the routing configuration
// you'll use depending on your screens and navigators.
// Look for detailed reference in:  
// https://reactnavigation.org/docs/configuring-links#mapping-path-to-route-names
const screenConfig = {
    // This are just example routes and screens, replace them with yours.
    screens: {
      Home: 'home',
      Profile: 'profile',
    },
};
// Replace this prefixes with your app's name as you set them previously
const prefixes = ['myapp://', 'https://myapp/']; 
const linking = useDeepLinks(prefixes, screenConfig);

return (
<NavigationContainer linking={linking}>
  ...
</NavigationContainer>
);
```

If you didn't had React navigation in your project, add the NavigationContainer tags in your App file or in the your highest order component.

Refer to [this link](https://reactnavigation.org/docs/getting-started/) to know how to get started with react navigation.

- In your index.js file add the following:

```javascript
import messaging from '@react-native-firebase/messaging';

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});
```

You can add any additional behavior when handling the notification on background state here.

- In your App file or wherever you need to start the process of registering the device (e.g. if you want the user to receive notifications only after the user has been logged in) add the following:  
  
```javascript
const onMessage = async (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
) => {
  // Create a default Android Notification channel, you can extend this one
  // or add as many channels as you need for your notification management.
  const channelId = await notifee.createChannel({
    // Adjust this values as needed.
    id: 'default-notification-channel',
    name: 'Default Channel',
    importance: AndroidImportance.DEFAULT,
  });
    
  // Display the notification on foreground.
  await notifee.displayNotification({
    title: remoteMessage.notification?.title,
    body: remoteMessage.notification?.body,
    android: {
      channelId,
      // Add your custom Android configs here.
    },
    ios: {
      // Add your custom iOS configs here.
    },
    data: remoteMessage.data,
    remote: true,
  });
  
  // Add as many additional behavior you need for 
  // handling notifications
  // ...
};

const onOpenNotification = (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage | null,
) => {
  if (remoteMessage?.data) {
    // Expects a link variable from the notification. 
    const link: string = remoteMessage.data.link;
    // If it has one, it opens it using deep linking.
    if (link) {
      Linking.openURL(link);
    }
  }
  
  // Add as many additional behavior you need for 
  // opening notifications
  // ...
};

const fcm = useFCM(onMessage, onOpenNotification);
```

When you call the useFCM hook, it registers the device and saves the token at the app's local storage. It also sets up the listeners for the notifications, so you can add the behavior you need for each event. 

For those listeners it will require the following parameters:

| Param              | Definition                                                                            |
|--------------------|---------------------------------------------------------------------------------------|
| onMessage          | Defines the behavior to execute when the device receives a notification for this app. |
| onOpenNotification | Defines the behavior to execute when the user opens a notification by tapping on it.  |

Feel free to modify the useFCM hook as needed and add as many configurations or results as you prefer.

## Accessing the stored Firebase Token

```javascript
import AsyncStorage from "@react-native-async-storage/async-storage";

AsyncStorage.getItem("fcmToken");
```

# Testing deep links

## Android

To test the intent handling in Android, run the following:

```powershell
npx uri-scheme open myapp://profile --android
```

or use adb directly:

```powershell
adb shell am start -W -a android.intent.action.VIEW -d "myapp://profile" com.simpleapp
```

## iOS

To test the URI on the simulator, run the following:

```powershell
npx uri-scheme open myapp://profile --ios
```

or use xcrun directly:

```powershell
xcrun simctl openurl booted myapp://profile
```

To test the URI on a real device, open Safari and type `myapp://profile`.


# References

- https://rnfirebase.io/
- https://rnfirebase.io/messaging/usage
- https://notifee.app/react-native/docs/installation
- https://reactnavigation.org/docs/getting-started/
- https://reactnavigation.org/docs/deep-linking/
- https://firebase.google.com/docs/android/setup
- https://firebase.google.com/docs/ios/setup
- https://firebase.google.com/docs/cloud-messaging/android/client
- https://www.npmjs.com/package/uri-scheme
- https://github.com/react-native-async-storage/async-storage
