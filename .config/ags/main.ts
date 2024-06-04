import { Media } from "./Media.js"

import "lib/session"
import options from "options"
import { setupDateMenu } from "widget/datemenu/dateMenu"

const win = Widget.Window({
    name: "mpris",
    class_name: "player1",
    anchor: ["top", "left"],
    child: Media(),
})
const win2 = Widget.Window ({
	name: "mpris2",
	visible: false,
	anchor: ["bottom", "left"],
	child: Media(),
})

//bar??
const time = Variable('', {
    poll: [1000, function() {
        return Date().toString();
    }],
});

const Bar = (monitor: number) => Widget.Window({
    monitor,
    name: `bar${monitor}`,
    class_name: "bar",
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
	    setupDateMenu()
    },
    style: "./style.css",
    windows: [
	win,
	win2,
    // Bar(0),
    ],
})
