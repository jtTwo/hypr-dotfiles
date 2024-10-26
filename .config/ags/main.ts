import { setupDashboard } from "./widgets/calendar"
import { setupQuickSettings } from "./widgets/quickSettings/quickSettings"

import { time } from "lib/variables"

import "style/style_sass_use"

// Notification generator code 

for (let i = 0; i < 1; i++)
  Utils.timeout(100, () => Utils.notify({
    summary: "NotificationPopup Ex",
    iconName: "user-trash-full-symbolic",
    body: "Lorem ipsum dolor sit amet, qui minim labore adipisicing "
      + "minim sint cillum sint consectetur cupidatat.",
    actions: {
      "Cool": () => print("pressed Cool"),
    },
  }))

const Bar = (monitor: number) => Widget.Window({
  monitor,
  name: `bar${monitor}`,
  anchor: ['top', 'left', 'right'],
  exclusivity: 'exclusive',
  child: Widget.CenterBox({
    start_widget: Widget.Label({
      hpack: 'center',
      label: 'Welcome to AGS!',
    }),
    end_widget: Widget.Label({
      hpack: 'center',
      label: time.bind(),
    }),
  }),
});

App.config({
  onConfigParsed: () => {
    // setupDashboard()
    setupQuickSettings()
  },

  windows: [Bar(0)],
});
