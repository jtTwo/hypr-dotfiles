// import { Media } from "./Media.js"

const notificationWidget = Widget.Calendar({

})

const calendarWidget = Widget.Box({
  children: [
    Widget.Calendar({
      className: "calendar",
    }),
  ]
})
const container = Widget.Box({
  vertical: true,
  children: [
    notificationWidget,
    Widget.Separator({
      css: "margin: 20px;"
    }),
    calendarWidget,
  ],
})

const windowCalendar = Widget.Window({
  margins: [12],
  name: "dashboard",
  anchor: ["top", "right", "bottom"],
  child: container,
})

export { windowCalendar }
