import { dependencies, bash } from "lib/utils"

const TMP = "/tmp/myconfig"

async function resetCss() {
  if (!dependencies("sass", "fd")) {
    console.log("dependencies")
    return
  }

  try {
    // const variablesFromDefaults_dir = `${TMP}/variables.sass`
    const sass_file_path = `${TMP}/styles.sass`
    const css_file_path = `${TMP}/styles.css`

    const get_files_paths = await bash(`fd '.sass' ${App.configDir}/style`)

    // file paths to array with regex
    // const arrayOfSassPaths = get_files_paths.split(/\s+/)

    const arrayOfSassPaths = get_files_paths.split("\n")

    const import_sass = arrayOfSassPaths.map(file_path => `@use '${file_path}'`)

    await Utils.writeFile(import_sass.join("\n"), sass_file_path)
    await bash(`sass ${sass_file_path} ${css_file_path}`)

    // applying css file to the config ags structure
    App.applyCss(css_file_path, true)

  } catch (error) {
    error instanceof Error ? logError(error) : console.error(error)
  }
}


await resetCss()
