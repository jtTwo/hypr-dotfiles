import { dependencies, bash } from "lib/utils"
import defaults from "defaults"

const TMP = "/tmp/myconfig"

const {
  padding,
  spacing,
  opacity,

  background,
  foreground,
  primary,

  border,
} = defaults.theme

const sass_var = (name: string, value: number | string) => `$${name}: ${value}`

const sass_vars = () => [
  sass_var("background", background),
  sass_var("hover-background", `transparentize(${foreground}, ${opacity * .9} / 100)`),

  sass_var("foreground", foreground),
  sass_var("primary", primary),
  sass_var("widget-background", `transparentize(${foreground}, ${opacity} / 100)`),

  sass_var("padding", `${padding}pt`),
  sass_var("spacing", `${spacing}pt`),
  sass_var("radius", `${border.radius}px`),

  sass_var("border-radius", `${border.radius}px`),
  sass_var("border-width", `${border.width}px`),

  sass_var("transition", `${defaults.transition}ms`),
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

    //working with external mixins path
    const sass_mixins_path = `${TMP}/mixins.sass`
    const use_sass_mixins = `@use '${sass_mixins_path}' as *`

    const get_sass_mixins_paths = await bash(`fd -F '.sass' ${App.configDir}/style/mixins`)
    const arrayOfMixins = get_sass_mixins_paths.split("\n")

    const arrayOfMixinsContents = [use_sass_vars, ...arrayOfMixins.map(path => Utils.readFile(path))]
    await Utils.writeFile(arrayOfMixinsContents.join("\n"), sass_mixins_path)


    const sass_file_path = `${TMP}/styles.sass`
    const css_file_path = `${TMP}/styles.css`

    const get_files_paths = await bash(`fd -F '.sass' ${App.configDir}/style -E mixins`)

    // file paths to array with regex
    // const arrayOfSassPaths = get_files_paths.split(/\s+/)
    const arrayOfSassPaths = get_files_paths.split("\n")
    const arrayOfSassContents = [use_sass_vars, use_sass_mixins, ...arrayOfSassPaths.map(path => Utils.readFile(path))]

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
