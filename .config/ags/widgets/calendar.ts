// import { Media } from "./Media.js"
// import notifications from ""
import notificationColumn from "widgets/notificationColumn"

const calendarWidget = Widget.Box({
  className: "calendar-container",
  children: [
    Widget.Calendar({
      className: "calendar",
      hexpand: true,
      hpack: "center",
    }),
  ]
})
const container = Widget.Box({
  class_name: "dashboard",
  vertical: true,
  children: [
    notificationColumn(),
    Widget.Separator({
      class_name: "separator"
      // css: "margin: 20px;",
    }),
    calendarWidget,
  ],
})

const dashboard = Widget.Window({
  // margins: [12], //gives css margin space to the window 
  name: "dashboard",
  anchor: ["top", "right", "bottom"],
  child: container,
})

// setup the dashboard window to add it to the ags interface
export function setupDashboard() {
  App.addWindow(dashboard)
}
