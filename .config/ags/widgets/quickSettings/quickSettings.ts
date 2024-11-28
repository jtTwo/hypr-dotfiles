import notificationColumn from "./settings/brightness"

const settings = Widget.Box({
  class_name: "quickSettings",
  children: [
    Widget.Box({
      class_name: "sliders-box",
      children: [
        Brightness(),
      ]
    })
  ]
})

const quickSettings = Widget.Window({
  // margins: [12], //gives css margin space to the window 
  name: "quickSettings",
  anchor: ["top", "right"],
  child: settings,
})

// setup the dashboard window to add it to the ags interface
export function setupQuickSettings() {
  App.addWindow(quickSettings)
}
