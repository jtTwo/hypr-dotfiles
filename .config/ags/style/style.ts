import { dependencies } from "lib/utils"

async function resetCss() {
  if (!dependencies("sass", "fd")) {
    console.log("dependencies")
    return
  }
}


await resetCss()
