const notifications = await Service.import("notifications")
// import icons from "lib/icons"

// this import of type is a object that compares the object to be in that format
// import { type Notification } from "types/service/notifications"

//function that returns a notifications Array from the notifications service import
const notificationArray = notifications.bind("notifications")

// function to generate icons to the notification.notification[n] to return proper icon with a box widget
function NotificationIcon({ app_entry, app_icon, image }) {
  if (image) {
    return Widget.Box({
      css: `background-image: url("${image}");`
        + "background-size: contain;"
        + "background-repeat: no-repeat;"
        + "background-position: center;",
    })
  }

  let icon = "dialog-information-symbolic"
  if (Utils.lookUpIcon(app_icon))
    icon = app_icon

  if (app_entry && Utils.lookUpIcon(app_entry))
    icon = app_entry

  return Widget.Box({
    child: Widget.Icon(icon),
  })
}

console.log(notificationArray)
const notifIcon = Widget.Box({
  children:
    notifications.bind("notifications").as(n => {
      // console.log(NotificationIcon(n[0]))
      // NotificationIcon(n[0]) 
      // console.log(notifications)
      const icons = n.map(notification => NotificationIcon(notification))
      // console.log(typeof (icons))
      return icons
      // return Widget.Box({ child: NotificationIcon(n[0]) })
    }),
})
// upside of the notificationColumn
const clearNotificationsButton = Widget.Button({
  on_clicked: notifications.clear,
  //do nothing if the array is empty
  sensitive: notificationArray.as(n => n.length > 0 ? true : false),
  child: Widget.Box({
    children: [
      Widget.Label("Clear "),
      Widget.Label({
        label: notificationArray.as(n => (n.length > 0) ? "󰩹" : "󰩺")
      }),
      // using the widget icons 
      // Widget.Icon({ icon: notificationArray.as(n => (n.length > 0) ? "user-trash-full-symbolic" : "user-trash-symbolic") })
    ]
  })
})

const header = Widget.Box({
  children: [
    Widget.Label({ label: "Notifications" + notificationArray.as(n => n.length) }),
    clearNotificationsButton,
  ]
})

// notifcationList Object to unify the notifications and headers and clear button
const notificationColumn = Widget.Box({
  vertical: true,
  children: [
    header,
    notifIcon,
  ]
})
// Export the notification list

export default () => notificationColumn
