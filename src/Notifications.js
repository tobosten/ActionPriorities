
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

    scheduleNotification({ date, id, title, message }) {
        PushNotification.localNotificationSchedule({
            channelId: "reminders",
            id: id,
            title: title,
            message: message,
            date: date,
        })
    }


    scheduleNotificationRepeat({ date, id, title, message, repeat }) {
        PushNotification.localNotificationSchedule({
            channelId: "reminders",
            id: id,
            title: title,
            message: message,
            date: date,
            repeatType: repeat //repeats  month | week | day | hour | minute
        })

    }
    /* 
        cancelLocalNotification({ id }) {
            PushNotification.cancelLocalNotification({ id: `${id}` })
    
    
        } */

    cancelAllNotifications() {
        PushNotification.cancelAllLocalNotifications()
    }
}

export default new Notifications();


