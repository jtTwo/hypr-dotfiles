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
              on_clicked: () => {
                Notification.close()
                // deleting the notification object not the widget
                // Notification.close
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
    }),
  ]
})
// animates the notification widget
const animateNotification = (_notification: Notification) => Widget.Revealer({
  name: `animationN ${_notification.id}`,
  // revealChild: true,
  transition: "crossfade",
  transitionDuration: 200,
  child: notification(_notification),
  // setup: self => Utils.timeout(200, () => {
  setup: (self) => Utils.timeout((_notification.id <= 1) ? 200 : _notification.id * 200, () => {

    console.log("animation timeout" + _notification.id + _notification.id * 50)
    if (!self.is_destroyed)
      self.reveal_child = true;
  })
})
//   .hook(notifications, self => {
//   if (self.isDestroyed)
//     self.revealChild = false
// }, "changed")
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

// this list works with two different signals on the hooks
const notificationList3 = () => {
  // get the id of the notification and map it in a single object like {id, animateNotifcation} which the object will have its proper id assigned to it
  // the :Map<....> is typescript notation that specifies what the map will contain
  const map: Map<number, ReturnType<typeof animateNotification>> = new Map

  const widgetBox = Widget.Box({
    name: "parent box",
    vertical: true,
    children: notifications.notifications.map(_notification => {
      const _animateNotification = animateNotification(_notification)
      map.set(_notification.id, _animateNotification)
      return _animateNotification
    })
  })

  return widgetBox
    .hook(notifications, (self, id) => {
      // at inizializing the hook the id is undefined therefore is deleted afterwards,
      // this condition will not map the undefined stuff
      if (id !== undefined) {
        // console.log(self.children.length, notifications.notifications.length, id)

        // the getNotificaiton(id ) will return the object notification with the id that triggered the hook that indicates a new notification has been notified with this id 
        // the !at the end means the value cannot return undefined
        const _notification = notifications.getNotification(id)!
        const _animateNotification = animateNotification(_notification)
        map.set(id, _animateNotification)

        // add the new notification to the start of the array and then the previous children
        self.children = [_animateNotification, ...self.children]
        notifications.notifications.map(_notification => console.log(`${_notification.id} , ${map.get(_notification.id).name!}`))
        // self.children = notifications.notifications.map(_notification => animateNotification(_notification))
        // const lid = notifications.notifications.map(_n => _n.id)
      }
    }, "notified")
    .hook(notifications, (self, id: number) => {
      console.log(self.name, id)
      if (id !== undefined) {
        const _animateNotification = map.get(id)!
        // _animateNotification.transition = "slide_right"
        // _animateNotification.transition_duration = 700
        _animateNotification.reveal_child = false
        Utils.timeout(500, () => {
          _animateNotification.destroy()
          map.delete(id)
        })
      }
    }, "closed")
}

//*** when the notification box is empty this is the place holder

const emptyPlaceHolder = Widget.Box({
  children: [
    Widget.Label({
      label: "Your imbox is empty!"
    })
  ]
})

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
    Widget.Scrollable({
      vexpand: true,
      child: Widget.Box({
        children: [
          notificationList3(),
          emptyPlaceHolder,
        ]
      })
    }),
  ]
})

// Export the notification list
export default () => notificationColumn
