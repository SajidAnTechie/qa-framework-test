# qa-framework
This repository is the actual library that executes the testcases provided from excel file in selenium grid. It is written in **typescript** and is fully typed. 

## Setup
```
npm install
npm run dev
```

## Folder structure inside repository
- **commandPracticeScripts**: Some helpful scripts and configuration to test features in selenium. Use this file to write/develop new commands that need selenium driver.
- **dist**: Build folder
- **src**: All the library related codes
- **temporaryFiles**: Contains json response as we get from api. This is for development purpose only to speed up development as we won't need to call api.
## Folder structure inside src folder
- **library**: Contains the library models, abstract test engine and abstract commands. Classes from this folder can be extended to provide testing functionality in selenium, cypress, etc.
- **selenium**: Implements abstract classes from library and provides it's implementation using selenium testing framework.

## Important classes
- BaseCommand
- BaseTestEngine
- SeleniumBaseCommand
- SeleniumTestEngine
- SeleniumTestResult

## Supported Commands
- Visit,
- AssertEquals
- Select
- Type
- Click
- WaitUntil

## Supported Parameter Types
- Title
- Text
- XPath
- CSS
- Attribute
- Enter
- Tab
- Milliseconds
- Seconds
- URL
- Dropdown

## Contributing
Before creating a PR run the following commands:
```npm run lint:list```
Fix linter issues if any.
```npm run format```
Fixes any formatting issue using prettier.

## How is the functionality of this framework exposed as npm module
This is a private repository so we don't deploy the library to npm. To use it as a library, we did the following:
- Exposed **SeleniumTestEngine** in **src/index.ts** file.
- Change library entrypoint to **"main": "./dist/src/index.js",** in package.json

Because we need to transpile typescript code to javascript to be used by framework-client repository, before we deploy/use framework client library, we need to build qa-framework library. 

## Notes
- This repository utilizes abstract classes, chain inheritance and OOP concepts. Brushup on OOP is required. Most common functionality is provided by abstract classes and the child classes provide specific limited functionality.
- The library supports chained assertions from a single selected html element. This feature needs to be preserved by future commands as well.
- All the commands need to be tested on "frameworkTestWebsite". Add relevant html/js on test website.
- As this library is a file dependency, it needs to be shipped together with the client library. Pay special attention to file paths as it is the most common source of build failures.
