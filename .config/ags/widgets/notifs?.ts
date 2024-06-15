// import { Notification } from "types/service/notifications"

import { timestamp, time } from "lib/variables"

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
//       // NotificationIcon(n[0]) // console.log(notifications) const icons = n.map(notification => NotificationIcon(notification))
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
              on_clicked: () => {
                Notification.close()
              }
            }),
          ]
        }),
        // description content
        Widget.Label({
          // maxWidthChars: 24,
          label: Notification.body.trim(),
        })
      ]
    })
  ]
})
// console.log(Array.from(notifications.notifications))

//*** notification list

const notificationList = () => {
  // creating map that maps the id of the notification with its widget itself
  const map: Map<number, ReturnType<typeof notification>> = new Map

  const widgetNotifBox = Widget.Box({
    vertical: true,
    children: notifications.notifications.map(n => {
      const _notification = notification(n)
      map.set(n.id, _notification)
      return _notification
    })
    //check the changes on the notifications service to return a list of widget notifications
  })

  function remove(self: unknown, id: number) {
    const _notification = map.get(id)
    if (_notification) {
      // n.reveal_child = false
      Utils.timeout(200, () => {
        // n.destroy()
        map.delete(id)
      })
    }
  }

  return widgetNotifBox
    // .hook(notifications, (self, id: number) => remove(self, id), "closed")
    .hook(notifications, (self, id: number) => {
      self.children = notifications.notifications.map(_notification => notification(_notification))
      if (id !== undefined) {
        if (map.has(id))
          console.log("")
        // console.log(true)
        // console.log(self, id)
        // remove(null, id)
      }
      // console.log(id)
    }, "changed")
}

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
    notificationList(),
  ]
})

// Export the notification list
export default () => notificationColumn
