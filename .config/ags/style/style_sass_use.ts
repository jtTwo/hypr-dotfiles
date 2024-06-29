import { dependencies, bash } from "lib/utils"
import defaults from "defaults"

const TMP = "/tmp/myconfig"

const {
  padding,
  radious,
} = defaults.theme

const sass_var = (name: string, value: number | string) => `$${name}: ${value}`

const sass_vars = () => [
  sass_var("padding", `${padding}pt`),
  sass_var("radious", `${radious}pt`),
]

async function resetCss() {
  if (!dependencies("sass", "fd")) {
    console.log("dependencies")
    return
  }

  try {
    const variablesFromDefaults_path = `${TMP}/variables.sass`
    //writing file the variables from sass_variables const
    await Utils.writeFile(sass_vars().join("\n"), variablesFromDefaults_path)
    const use_sass_vars = `@use '${variablesFromDefaults_path}' as *`

    const sass_file_path = `${TMP}/styles.sass`
    const css_file_path = `${TMP}/styles.css`

    const get_files_paths = await bash(`fd -F '.sass' ${App.configDir}/style`)

    // file paths to array with regex
    // const arrayOfSassPaths = get_files_paths.split(/\s+/)
    const arrayOfSassPaths = get_files_paths.split("\n")
    const arrayOfSassContents = [use_sass_vars, ...arrayOfSassPaths.map(path => Utils.readFile(path))]

    // write on the sass the sass contents from array 
    await Utils.writeFile(arrayOfSassContents.join("\n"), sass_file_path)
    await bash(`sass ${sass_file_path} ${css_file_path}`)

    // applying css file to the config ags structure
    App.applyCss(css_file_path, true)

  } catch (error) {
    error instanceof Error ? logError(error) : console.error(error)
  }
}

await resetCss()
