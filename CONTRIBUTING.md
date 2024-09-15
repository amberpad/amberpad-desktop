# Contributing


## Setting up
Amberpad uses [Atom Electron](https://www.electronjs.org/) as the runtime, the environment uses *nps* module to manage the npm scripts (The complete list of scripts can be read in the `package-scripts.js` file or running `npm run nps`), to avoid the long command nps can be insalled globally running `npm install -g nps`, follow the these steps to setup the environment:

  * Clone this repository

  ```bash
  git clone https://github.com/amberpad/amberpad-desktop.git
  cd amberpad-desktop
  ```

  1. Make sure you have NodeJS(preferably v20 or superior) installed
  2. Checkout to _development_ branch:
  
    ```bash
    $ git checkout development
    ```
    
  3. Install dependencies:

      ```bash
      $ npm install
      ```
      
  4. Start Amberpad using the prebuilt version of Electron:

    ```bash
      $ npm run nps start
    ```
    or
    ```bash
      $ nps start
    ```

### Project structure
Electron has three main processes: main, renderer, and preload. Each process is bundled separately using Esbuild. Configuration files for each process are:

- `main.esbuild.mjs` (for Node.js)
- `renderer.esbuild.mjs` (for the web browser)
- `preload.esbuild.mjs` (for CommonJS modules)

## Environment settings
Environmental variables are only supported in development environment. To set settings permanently, write them to the `settings.mjs` file. Settings in `settings.mjs` take precedence over environment variables. Usage of a .env file in the root of the project is also supported.

### AMBERPAD_ENVIROMENT
Defines the running enviromennt:

`development | production | testing`

### AMBERPAD_DEBUG
Show errors or tecnichal information in the console:

`true | false`

### AMBERPAD_LOG_LEVEL
Level of errors to be reported in log file or console error.

`error | warn | info | verbose | debug | silly | false`

### AMBERPAD_ALLOW_VERSION_UPDATE
Show a notification when a new version is available and allow users to download and install updates directly from the app. A list of values is supported:

`darwin |win32 | linux`

Example: `darwin, win32, linux`

### AMBERPAD_SEED
Seed of data that is loaded after migrations are run in development mode. 

Allowed values are locations inside `resources/seed` folder, example: `migrations/001_initial.mts`

### Handling Bundling Issues
The current Esbuild configuration doesn't bundle modules togheter with the main process, this is because Esbuild has limited support for ESM imports. All imports in the main process are set as external or peer dependencies and added to the final `package.json` as dependencies. This doesn't happen when a module is loaded implicitly. To bundle implicitly imported modules, use the toBundle configuration in package.json. This configuration accepts the name of the module to be packaged and exports it to the final bundle.

Example of ussage: 

```JSON
{
  ...,
  toBundle": ["better-sqlite3"]
}
```

### Testing environment ([Playwright](https://playwright.dev/))
A testing environment is set up for automatic testing using [Playwright](https://playwright.dev/). All tests are located in the test folder at the root of the project. To run the tests, follow these steps:

1. Ensure dependencies are installed:
    ```bash
    $ npm install
    ```
2. Run the test suite:
    ```bash
    $ npm run nps test
    ```
    or run specific tests using a regular expression:
    
    ```bash
    $ npm run nps test.grep "[regular expression]"
    ```

### Naming protocol

Each test in the test suite should have a unique hash string to easily identify the test and run it separately using the `test.grep` command. The recommended tool for generating hash identifiers is [Short UUID Generator](https://uuidgenerator.dev/short-uuid).

### Seeds
The test workspace is configured to automatically build an instance of Electron with the app running, create a temporary database, and seed the database with test data. All seed files are located in the `/resources/seeds/` folder, which serves as the root directory for all seeds.