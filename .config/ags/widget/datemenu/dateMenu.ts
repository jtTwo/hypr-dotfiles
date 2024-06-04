// import dateColumn from "./DateColumn"
// import popupWindow from "widget/popupWindow"

// // stacking the columns into one widget box horizontally
// const row = () => Widget.Box({
// 	class_name: "Notification Date columns horizontal",
// 	vexpand: false,
// 	child: dateColumn(),
// })

// const dateMenu = () => popupWindow({
// 	name: "dateMenu",
// 	exclusivity: "exclusive",
// 	child: row(),
// })

// export function setupDateMenu() {
// 	App.addWindow(dateMenu())
// }


import PopupWindow from "widget/popupWindow"
// import NotificationColumn from "./NotificationColumn"
import DateColumn from "./DateColumn"
import options from "options"

// const { bar, datemenu } = options
// const pos = bar.position.bind()
// const layout = Utils.derive([bar.position, datemenu.position], (bar, qs) =>
//     `${bar}-${qs}` as const,
// )
const layout = "top-center"

const Settings = () => Widget.Box({
    class_name: "datemenu horizontal",
    vexpand: false,
    children: [
        // NotificationColumn(),
        Widget.Separator({ orientation: 1 }),
        DateColumn(),
    ],
})

const DateMenu = () => PopupWindow({
    name: "datemenu",
    exclusivity: "exclusive",
    // transition: pos.as(pos => pos === "top" ? "slide_down" : "slide_up"),
    layout: layout,
    child: Settings(),
})

export function setupDateMenu() {
    App.addWindow(DateMenu())
    // layout.connect("changed", () => {
    //     App.removeWindow("datemenu")
    //     App.addWindow(DateMenu())
    // })
}