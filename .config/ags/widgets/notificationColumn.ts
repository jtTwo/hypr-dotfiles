// import { Notification } from "types/service/notifications"

import { timestamp, time } from "lib/variables"

const notifications = await Service.import("notifications")
// import icons from "lib/icons"

// this import of type is a object that compares the object to be in that format
import { type Notification } from "types/service/notifications"

//function that returns a notifications Array from the notifications service import
const notificationArrayBind = notifications.bind("notifications")

// function to generate icons to the notification.notification[n] to return proper icon with a box widget
function NotificationIcon({ app_entry, app_icon, image }: Notification) {
  if (image) {
    return Widget.Box({
      class_name: "icon img",
      css: `background-image: url("${image}");`
        + "background-size: cover;"
        + "background-repeat: no-repeat;"
        + "background-position: center;",
        // + "min-width: 50px;" //there's already a config for this setting 
        // + "min-height: 50px;",
    })
  }

  let icon = "dialog-information-symbolic"
  if (Utils.lookUpIcon(app_icon))
    icon = app_icon

  if (app_entry && Utils.lookUpIcon(app_entry))
    icon = app_entry

  return Widget.Box({
    class_name: "icon",
    child: Widget.Icon({
      icon: icon,
      size: 35,
      hexpand: true,
    }),
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
  class_name: "notification",
  name: `my id ${Notification.id}`,
  children: [
    NotificationIcon(Notification),
    Widget.Box({
      vertical: true,
      children: [
        // notification header content
        Widget.Box({
          children: [
            Widget.Label({
              class_name: "title",
              hexpand: true,
              // justificationf: "left",
              // truncate: "end",
              xalign: 0,
              label: Notification.summary.trim() + " id:" + Notification.id,
            }),
            Widget.Label({
              class_name: "time",
              label: timestamp(Notification.time)
            }),
            Widget.Button({
              class_name: "close-button",
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
          class_name: "description",
          xalign: 0,
          wrap: true,
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
  transition: "slide_down",
  transitionDuration: 200,
  child: notification(_notification),
  // setup: self => Utils.timeout(200, () => {
  setup: (self) => Utils.timeout((_notification.id <= 1) ? 200 : _notification.id * 200, () => {

    console.log("animation timeout" + _notification.id + _notification.id * 50)
    if (!self.is_destroyed)
      self.reveal_child = true;
  })
})

//*** notification list

// this list works with two different signals on the hooks
const notificationList = () => {
  // get the id of the notification and map it in a single object like {id, animateNotifcation} which the object will have its proper id assigned to it
  // the :Map<....> is typescript notation that specifies what the map will contain
  const map: Map<number, ReturnType<typeof animateNotification>> = new Map
  // function invertNoficationOrder() {
  //   for (let i = notifications.notifications.length;i > 0; i--)
  //     let nArray = []
  //     nArray.push(notifications.notifications)
  //   return 0
  // }


  const widgetBox = Widget.Box({
    name: "parent box",
    vertical: true,
    children: notifications.notifications.map(_notification => {
      const _animateNotification = animateNotification(_notification)
      map.set(_notification.id, _animateNotification)
      return _animateNotification
    }).reverse()
  })

  return widgetBox
    .hook(notifications, (self, id) => {
      // at inizializing the hook the id is undefined therefore is deleted afterwards,
      // this condition will not map the undefined stuff
      if (id !== undefined) {
        //avoid inizializing duplicates and renew the existing notification
        if (map.has(id)) {
          const _animateNotification = map.get(id)
          if (_animateNotification) {
            _animateNotification.reveal_child = false
            Utils.timeout(1000, () => {
              _animateNotification.destroy()
              map.delete(id)
            })
          }
        }
        // console.log(self.children.length, notifications.notifications.length, id)

        // the getNotificaiton(id ) will return the object notification with the id that triggered the hook that indicates a new notification has been notified with this id 
        // the !at the end means the value cannot return undefined
        const _notification = notifications.getNotification(id)!
        const _animateNotification = animateNotification(_notification)
        map.set(id, _animateNotification)

        // add the new notification to the start of the array and then the previous children
        self.children = [_animateNotification, ...self.children]
        // notifications.notifications.map(_notification => console.log(`${_notification.id} , ${map.get(_notification.id).name}`)!)
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
  visible: notificationArrayBind.as(n => n.length === 0),
  vertical: true,
  vexpand: true,
  vpack: "center",
  hpack: "center",
  children: [
    Widget.Icon({
      icon: "notifications-disabled-symbolic"
    }),
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
  sensitive: notificationArrayBind.as(n => n.length > 0 ? true : false),
  child: Widget.Box({
    children: [
      Widget.Label("Clear "),
      Widget.Label({
        label: notificationArrayBind.as(n => (n.length > 0) ? "󰩹" : "󰩺")
      }),
      // using the widget icons 
      // Widget.Icon({ icon: notificationArray.as(n => (n.length > 0) ? "user-trashonti-full-symbolic" : "user-trash-symbolic") })
    ]
  })
})

const header = Widget.Box({
  class_name: "header",
  children: [
    Widget.Label({
      hexpand: true,
      hpack: "start",
      label: notificationArrayBind.as(n => `Notifications ${n.length}`)
    }),
    clearNotificationsButton,
  ]
})

//*** notifcationList Object to unify the notifications and headers and clear button
const notificationColumn = Widget.Box({
  class_name: "notifications",
  vertical: true,
  children: [
    header,
    batteryPercent,
    Widget.Scrollable({
      class_name: "scrollable",
      hscroll: "never",
      vexpand: true,

      child: Widget.Box({
        class_name: "notification-list-container",
        vertical: true,
        children: [
          notificationList(),
          emptyPlaceHolder,
        ]
      })
    }),
  ]
})

// Export the notification list
export default () => notificationColumn
