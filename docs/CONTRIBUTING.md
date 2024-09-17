# Contributing
Thank you for considering contributing to this project! We welcome all kinds of contributions, whether it's code, bug reports, documentation, or suggestions. This document provides guidelines to help you get started.

## Reporting Bugs
If you find a bug, please submit a detailed bug report to help us improve the app:

1. Check the [issues page](https://github.com/amberpad/amberpad-desktop/issues) to see if the bug has already been reported.
2. Create a new issue with the label `bug`, providing:
   - A descriptive title.
   - Steps to reproduce the issue.
   - What you expected to happen.
   - Screenshots (if applicable).

## Suggesting Features
We love to hear new ideas! To suggest a new feature:

1. Open a new issue with the label `enhanment`.
2. Describe the feature clearly and explain why it would be useful.

## Code Contributions
To contribute code:

1. **Start from the `develop` branch**:
   - Always base your work on the `develop` branch, which contains the latest development changes.
   - First, ensure you have the latest changes by pulling the `develop` branch:
     ```bash
     git checkout develop
     git pull origin develop
     ```

2. Create a new branch:
  ```bash
    git checkout -b feature-name
  ```

3. Make your changes following the coding standards:
  - Keep code simple and well-documented.
  - Use meaningful commit messages.

4. Run tests to make sure your changes don’t break anything:
  ```bash
    npm run nps test
  ```

5. Push your changes to your forked repository:
  ```bash
     it push origin feature-name
  ```

6. Submit a Pull Request (PR):
   - When you're ready to submit your code, open a Pull Request (PR) against the develop branch.
  - Go to the Pull Requests section of the repository.
  - Select your branch and submit your PR.
  - Clearly describe what your PR does and link any related issues.

7. Code Review:
   - Your PR will undergo review. Make any changes requested by the maintainers.
   - Once approved, your code will be merged into the develop branch and later incorporated into main during a release cycle.

## Setting up
Amberpad uses [Atom Electron](https://www.electronjs.org/) as the runtime, the environment uses `nps` module to manage the npm scripts (The complete list of scripts can be read in the `package-scripts.js` file or running `npm run nps`), to avoid the long command nps can be insalled globally running `npm install -g nps`, follow the these steps to setup the environment:

  * Clone this repository

  ```bash
  git clone https://github.com/amberpad/amberpad-desktop.git
  cd amberpad-desktop
  ```

  1. Make sure you have NodeJS(preferably v20 or superior) installed
  2. Checkout to _develop_ branch:
  
    ```bash
    $ git checkout develop
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


## Style Guidelines
- JavaScript Style: Follow Airbnb JavaScript Style Guide.
- Commit Messages: Write clear, concise commit messages.
  - Example: Added feature to create new note or Fixed bug in note deletion function.

## License
By contributing, you agree that your contributions will be licensed under the MIT License.