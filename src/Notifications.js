
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
        PushNotification.getScheduledLocalNotifications(() => {
            
        });
    };

    scheduleNotification({ date, title, message, repeat }) {
        PushNotification.localNotificationSchedule({
            channelId: "reminders",
            title: title,
            message: message,
            date,
            repeatType: repeat //repeats every day
        })
    }
}

export default new Notifications();


