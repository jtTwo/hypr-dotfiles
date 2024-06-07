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
    Widget.Separator({}),
    calendarWidget,
  ],
})

const windowCalendar = Widget.Window({
  name: "dashboard",
  anchor: ["top", "right", "bottom"],
  child: container,
})

export { windowCalendar }
