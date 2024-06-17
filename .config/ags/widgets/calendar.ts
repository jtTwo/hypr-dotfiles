// import { Media } from "./Media.js"
// import notifications from ""
import notificationColumn from "widgets/notificationColumn"

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
    notificationColumn(),
    Widget.Separator({
      css: "margin: 20px;",
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

// setup the dashboard window to add it to the ags interface
export function setupDashboard() {
  App.addWindow(windowCalendar)
}
