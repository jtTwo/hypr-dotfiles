import { dependencies, bash } from "lib/utils"
import defaults from "defaults"

const TMP = "/tmp/myconfig"

const {
  padding,
  radius,

  background,
  foreground,
  primary,
} = defaults.theme

const sass_var = (name: string, value: number | string) => `$${name}: ${value}`

const sass_vars = () => [
  sass_var("background", background),
  sass_var("foreground", foreground),
  sass_var("primary", primary),

  sass_var("padding", `${padding}pt`),
  sass_var("radius", `${radius}pt`),
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

    const sass_file_path = `${TMP}/styles.sass`
    const css_file_path = `${TMP}/styles.css`

    const get_files_paths = await bash(`fd '.sass' ${App.configDir}/style`)

    // file paths to array with regex
    // const arrayOfSassPaths = get_files_paths.split(/\s+/)
    const arrayOfSassPaths = [variablesFromDefaults_path, ...get_files_paths.split("\n")]

    const import_sass = arrayOfSassPaths.map(file_path => `@import '${file_path}'`)

    await Utils.writeFile(import_sass.join("\n"), sass_file_path)
    await bash(`sass ${sass_file_path} ${css_file_path}`)

    // applying css file to the config ags structure
    App.applyCss(css_file_path, true)

  } catch (error) {
    error instanceof Error ? logError(error) : console.error(error)
  }
}

await resetCss()
