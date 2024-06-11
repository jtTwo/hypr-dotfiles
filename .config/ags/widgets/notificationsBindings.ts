// import { Notification } from "types/service/notifications"

import { timestamp } from "lib/variables"

const notifications = await Service.import("notifications")
// import icons from "lib/icons"

// this import of type is a object that compares the object to be in that format
import { type Notification } from "types/service/notifications"

//function that returns a notifications Array from the notifications service import
const notificationArray = notifications.bind("notifications")

// function to generate icons to the notification.notification[n] to return proper icon with a box widget
function NotificationIcon({ app_entry, app_icon, image }: Notification) {
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

// show a list of icons test 
// const notifIcon = Widget.Box({
//   children:
//     notifications.bind("notifications").as(n => {
//       // console.log(NotificationIcon(n[0]))
//       // NotificationIcon(n[0]) 
//       // console.log(notifications)
//       const icons = n.map(notification => NotificationIcon(notification))
//       // console.log(typeof (icons))
//       return icons
//       // return Widget.Box({ child: NotificationIcon(n[0]) })
//     }),
// })

//*** notification structure

const notification = (Notification: Notification) => Widget.Box({
  // NAME identifiers for any mapped widget (just debugging )
  name: `my id ${Notification.id}`,
  // className: `my class ${Notification.id}`,
  children: [
    NotificationIcon(Notification),
    Widget.Box({
      vertical: true,
      children: [
        // notification header content
        Widget.Box({
          children: [
            Widget.Label({
              label: Notification.summary.trim(),
            }),
            Widget.Label({
              label: timestamp(Notification.time)
            }),
            Widget.Button({
              child: Widget.Icon("window-close-symbolic"),
              on_clicked: Notification.close
            }),
          ]
        }),
        // description content
        Widget.Label({
          // maxWidthChars: 24,
          label: Notification.body.trim(),
        })
      ]
    }),
  ]
})
// console.log(Array.from(notifications.notifications))

//*** notification list with bindings

// const notificationList = Widget.Box({
//   vertical: true,
//   children:
//     notifications.bind("notifications").as(n => {
//       // console.log(NotificationIcon(n[0]))
//       // NotificationIcon(n[0]) 
//       // return Widget.Box({ child: NotificationIcon(n[0]) })
//       // console.log(notifications)
//
//       const notifications = n.map(_notification => notification(_notification))
//       return notifications
//     }),
// })

// const notificationList2 = Widget.Box({
//   vertical: true,
//   setup: (self) => {
//     self.hook(notifications, (self) => {
//       self.children = notifications.notifications.map(_notification => notification(_notification))
//     },)
//   }
// })

const notificationList3 = Widget.Box({ vertical: true }).hook(notifications, (self) => {
  self.children = notifications.notifications.map(_notification => notification(_notification))
},)

//hook expample
const { speaker } = await Service.import("audio")
// .hook(GObject, callback, signal?)
const batteryPercent = Widget.Label().hook(speaker, self => {
  self.label = `${speaker.volume}%`
  // self.visible = battery.available
}, "changed")

//*** upside heading container of the notificationColumn

const clearNotificationsButton = Widget.Button({
  on_clicked: notifications.clear,
  //disable if the array is empty
  sensitive: notificationArray.as(n => n.length > 0 ? true : false),
  child: Widget.Box({
    children: [
      Widget.Label("Clear "),
      Widget.Label({
        label: notificationArray.as(n => (n.length > 0) ? "󰩹" : "󰩺")
      }),
      // using the widget icons 
      // Widget.Icon({ icon: notificationArray.as(n => (n.length > 0) ? "user-trashonti-full-symbolic" : "user-trash-symbolic") })
    ]
  })
})

const header = Widget.Box({
  children: [
    Widget.Label({ label: notificationArray.as(n => `Notifications ${n.length}`) }),
    clearNotificationsButton,
  ]
})

//*** notifcationList Object to unify the notifications and headers and clear button
const notificationColumn = Widget.Box({
  vertical: true,
  children: [
    header,
    batteryPercent,
    notificationList3,
  ]
})

// Export the notification list
export default () => notificationColumn
