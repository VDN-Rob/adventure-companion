Possible to see builds on expo.dev, with github login.



eas build --platform android --profile preview --local

// Enable usb debugging in developper options, then:

adb devices

adb -s ABC123456789 install path/to/your.apk