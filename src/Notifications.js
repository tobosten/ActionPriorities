
import PushNotification from "react-native-push-notification";

class Notifications {
    constructor() {
        PushNotification.configure({
            onRegister: function (token) {

            },
            onNotification: function (notification) {
                console.log("Notification:", notification)
            },
            popInitialNotification: true,
            requestPermissions: false
        });
        PushNotification.createChannel(
            {
                channelId: "reminders",
                channelName: "task reminder",
                channelDescription: "reminder for tasK",
            },
            () => { },
        );
        PushNotification.getScheduledLocalNotifications(rn => {
            console.log("sn --- ", rn)
        });
    };

    scheduleNotification({date, title, message}) {
        PushNotification.localNotificationSchedule({
            channelId: "reminders",
            title: title,
            message: message,
            date,
        })
    }
}

export default new Notifications();


