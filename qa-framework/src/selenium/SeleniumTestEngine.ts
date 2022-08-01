import { Builder, Locator, ThenableWebDriver } from 'selenium-webdriver';

import Logger from '../logger';
import BaseCommand from '../library/BaseCommand';
import TestResult from '../library/models/TestResult';
import SeleniumTestResult from './SeleniumTestResult';
import TestStatus from '../library/models/TestStatus';
import BaseTestEngine from '../library/BaseTestEngine';
import SeleniumBaseCommand from './SeleniumBaseCommand';
import generateCommands from './commands/generateCommands';
import { TestCaseResponse } from '../library/models/TestCaseResponse';
import { delay } from '../library/utils';

class SeleniumTestEngine extends BaseTestEngine {
  driver: ThenableWebDriver;

  commands: SeleniumBaseCommand[];

  constructor(testCaseResponse: TestCaseResponse) {
    super(testCaseResponse);
    this.driver = this.getDriver();
    this.commands = [];

    // TODO Fix later
    // commenting this code because for some reason, it was causing tests to fail
    // handle global errors to close driver
    // not doing this here causes selenium grid to get stuck for a long time
    // process.on('uncaughtException',  (err) => {
    //   Logger.error('uncaughtException');
    //   Logger.error(err);
    //   this.closeDriver();
    // });
    // process.on('unhandledRejection', (err) => {
    //   Logger.error('unhandledRejection');
    //   Logger.error(err);
    //   this.closeDriver();
    // });
  }

  // production setup
  private getDriver = () => {
    const SELENIUM_GRID_HOST = process.env.SELENIUM_GRID_HOST || '127.0.0.1';
    const SELENIUM_GRID_PORT = process.env.SELENIUM_GRID_PORT || 4444;
    const gridUrl = `http://${SELENIUM_GRID_HOST}:${SELENIUM_GRID_PORT}/wd/hub`;

    const capabilities = {
      browserName: 'chrome',
      resolution: '1280x800',
      network: true,
      visual: true,
      console: true,
      video: true, // set video to false later so that vm performance is improved
      name: 'QA-Framework', 
      build: 'Nodejs selenium grid', 
    };
    return new Builder().usingServer(gridUrl).withCapabilities(capabilities).build();
  }

  // only use this when not using docker
  // helpful when debugging and extending the framework locally
  // private getDriver = () => {
  //   const capabilities = {
  //     browserName: 'chrome',
  //   };
  //   return new Builder().withCapabilities(capabilities).build();
  // }

  private closeDriver = () => {
    this.driver.quit();
  }

  protected getAllCommands(): BaseCommand[] {
    this.commands = generateCommands(this.testCaseResponse, this.driver);
    return this.commands;
  }

  protected allTestsCompleted(): void {
    this.closeDriver();
  }

  public async executeTestCases() {
    const validTestCases = await this.validateCommands();
    if (!validTestCases) {
      this.closeDriver();
      return;
    }
    Logger.log('Start Test Execution');
    const testResults: TestResult[] = [];

    let previousLocator: Locator | null = null;
    this.onTestStarted();
    for (const command of this.commands) {
      try {

        command.setLocator(previousLocator);
        const result: SeleniumTestResult = await command.executeTest();
        previousLocator = result.locator;
        testResults.push(result);
        this.onSingleTestFinished(result);
        if (result.status === TestStatus.Fail) {
          // TODO: add new status "Test aborted because of exception" and listener to notify client
          this.closeDriver();
          break;
        }
      } catch (error) {
        if(error instanceof Error) {
          Logger.error(error.name);
          Logger.error(error.message);
          Logger.error(error.stack);
        }
        Logger.error(error);
        this.closeDriver();
        break;
      }
    }

    this.onAllTestsFinished(testResults);
    Logger.log('Finish Test Execution');
    this.allTestsCompleted();
  }
}

export default SeleniumTestEngine;
