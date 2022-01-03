# FCM Django V-1.0.7

*Official documentation:*
```https://fcm-django.readthedocs.io/en/1.0.7/```

### Pre requirements:
JSON key file for firebase FCM

## Installation:
In the file: ```requirements/base.txt```

Add ```fcm-django==1.0.7 # https://fcm-django.readthedocs.io/en/1.0.7/```

## After installation:

In the file ```.gitignore``` file add the name of the key file (JSON). Eg.
```dogit-fcm-dev.json```

+ The keyfile can not be tracked in the repository
+ The keyfile will be placed in the root of the project

+ ### For local development:
  + In the file ```.envs/.local/.django``` add the environment variable:
  ```GOOGLE_APPLICATION_CREDENTIALS={{keyfile in json extension}}```
  + Execute the commands
  ```
  docker-compose -f local.yml build
  docker-compose -f local.yml up
  ```
+ ### For Stage and Production:
  + In the file ```.envs/.production/.django``` add the environment variable:
    ```GOOGLE_APPLICATION_CREDENTIALS={{keyfile in json extension}}```
  + Execute the commands
  ```
  docker-compose -f local.yml build
  docker-compose -f local.yml run --rm django python manage.py migrate
  docker-compose -f local.yml up -d
  ```

## Configuration:
In the file: ```config/settings/base.py```

Under ```THIRD_PARTY_APPS``` add:
```"fcm_django",```

```
THIRD_PARTY_APPS = [
    ...
    "fcm_django",

]
```


Add the next configuration:

```
FIREBASE_APP = initialize_app()

FCM_DJANGO_SETTINGS = {
    "APP_VERBOSE_NAME": "Push Notifications",
    "ONE_DEVICE_PER_USER": True,
    "DELETE_INACTIVE_DEVICES": True,
    "UPDATE_ON_DUPLICATE_REG_ID": True,
}
```


In the file ```config/api_router.py``` import

```from fcm_django.api.rest_framework import FCMDeviceAuthorizedViewSet```

And register a new router:

```router.register("devices", FCMDeviceAuthorizedViewSet)```

This will enable the needed endpoints for device register

# Push notification
This will be the basic structure to send any push notification where needed

#### First import:
```
from fcm_django.models import FCMDevice
from firebase_admin.messaging import Message, Notification
```

#### Notification:
```
my_notification = Message(
    notification=Notification(title="{{title}}", body="{{text}}"),
    data={
        "link": "{{Link provided for mobile development}}",
        }
    )

device = FCMDevice.objects.all().first() # This is an example to get
the device to be notified, you can get the device attached to any user by
filtering the queryset by user

device.send_message(my_notification)
```