# React Native FCM Configuration for Push Notifications in Android & iOS

This is a guide to setup FCM Push notifications in a `bare` React Native project. If you are using Expo and you find any trouble while following the guide, please refer to the documentation links found in the [References](#references) section and follow the required steps for Expo.

We'll be using Firebase's FCM service together with the following libraries to display local and push notifications:

- React Navigation
- React Native Firebase
- Notifee

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

6.- Finally, Sync the project with Gradle files by pressing "Sync now", ![](https://www.gstatic.com/mobilesdk/160330_mobilesdk/images/android_studio_gradle_changed_butterbar@2x.png)
or by using `File > Sync project with Gradle files` in Android Studio.

Now open your `AndroidManifest.xml` file and edit the following:

1. Make sure `launchMode` of your `MainActivity` is set to `singleTask`.
2. Add the new `intent-filter` inside the `MainActivity` with a `VIEW` type action:

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
        <data android:scheme="my_project_name" />
    </intent-filter>
</activity>
```

Here, you'll have to replace with the name of your app where it says "my_project_name". This will be the same name used in the backend for navigating when opening a notification. 3. Add the following service:

```xml
<service
    android:name=".java.MyFirebaseMessagingService"
    android:exported="false">
    <intent-filter>
        <action android:name="com.google.firebase.MESSAGING_EVENT" />
    </intent-filter>
</service>
```

### Customizing notifications icons in Android

Within the application component, metadata elements to set a default notification icon and color.

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

# References

- https://rnfirebase.io/
- https://rnfirebase.io/messaging/usage
- https://notifee.app/react-native/docs/installation
- https://reactnavigation.org/docs/deep-linking/
- https://firebase.google.com/docs/android/setup
- https://firebase.google.com/docs/ios/setup
- https://firebase.google.com/docs/cloud-messaging/android/client
