# React Native FCM Configuration for Push Notifications in Android & iOS

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

# Firebase

First we'll need a Firebase project. If you don't have one already, [create one](https://console.firebase.google.com/). You can [sign into Firebase](https://console.firebase.google.com/) using your Google account.

Then we'll need to create an Android and iOS app on our Firebase project.

## Android

# References

If any step of this guide is not working for you or you are receiving any error during the same, please refer to the following documentation links:

- https://rnfirebase.io/
- https://rnfirebase.io/messaging/usage
- https://notifee.app/react-native/docs/installation
- https://reactnavigation.org/docs/deep-linking/
- https://firebase.google.com/docs/android/setup
- https://firebase.google.com/docs/ios/setup
