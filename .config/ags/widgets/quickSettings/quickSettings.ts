const container = Widget.Box({
  class_name: "header",
  children: [
    Widget.Label({
      hexpand: true,
      hpack: "start",
      label: `Notifications `,
    }),
  ]
})

const quickSettings = Widget.Window({
  // margins: [12], //gives css margin space to the window 
  name: "quickSettings",
  anchor: ["top", "right"],
  child: container,
})

// setup the dashboard window to add it to the ags interface
export function setupQuickSettings() {
  App.addWindow(quickSettings)
}
