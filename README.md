## Amberpad
App to make annotations with the visuals of a Webchat.

## Enviroment settings
Enviromental variables only supported in development enviroments

| Variables | Description | Type |
|-|-|-|
| AMBERPAD_ENVIROMENT |  Defines the running enviroment | "development" or "Production" or "testing" |
| AMBERPAD_DEBUG | Show errors and extra information in the console, if packaging app to testing enviroment and set to true it also shows the window with the graphic interface | "true" or "false" |
| AMBERPAD_RESET_SETTINGS_STORE | Resets the file that contains settings and runnning data to default values | "true" or "false" |
| AMBERPAD_DB_PATH | The path to the sqlite database file | string |


## Package.json settings

### toBundle
Current project esbuild configuration doesn't allow for modules to be bundled in the main bundle because esbuild doesnt work well with *ESM* imports, so all imports are set as external or peer dependencies, so to bundle this dependencies they have to be imported explicitly, to avoid that there is a custom pluggin that bundles all imported uses in the main thread but is not working with dynamic requires in source code, so if some packages are not automatically bundled when electron is packed you can added it explicitly in toBundle config of the package.json (example: `"toBundle": ["better-sqlite3"]`). 
