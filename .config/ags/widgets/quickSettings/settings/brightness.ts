import brightness from "service/brightness"

const brightnessButton = Widget.Box({

})

const brightnessSlider = Widget.Box({
  value: brightness.bind("screen"),
})


const brightness = Widget.Box({
  class_name: "brightness",
  children: [
    brightnessSlider(),
  ],
})

export default () => brightness
