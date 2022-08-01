import { Locator, ThenableWebDriver } from 'selenium-webdriver';

import Logger from '../logger';
import BaseCommand from '../library/BaseCommand';
import getExceptionOccuredTestResult from './utils';
import SeleniumTestResult from './SeleniumTestResult';
import { Sheet, Testcase, testCaseToString } from '../library/models/TestCaseResponse';
import { delay, saveBase64StringAsImage, testResultToString } from '../library/utils';

const COMMAND_DELAY = 1 * 1000;
abstract class SeleniumBaseCommand extends BaseCommand {
  driver: ThenableWebDriver;

  locator: Locator | null;

  constructor(testCase: Testcase, sheet: Sheet, driver: ThenableWebDriver) {
    super(testCase, sheet);
    this.driver = driver;
    this.locator = null;
  }

  setLocator(locator: Locator | null) {
    this.locator = locator;
  }

  async takeScreenshot(fileName: string): Promise<void> {
    const base64String = await this.driver.takeScreenshot();
    await delay(200);
    saveBase64StringAsImage(base64String, fileName);
  }

  async executeTest(): Promise<SeleniumTestResult> {
    try {
      const start = new Date().getTime();
      // we need to wait for some time to let the html in webpage be hydrated 
        // this is spedifically required for selenium because unlike cypress, it
        // doesn't wait for network calls and html hydration to complete before 
        // executing tests
      await delay(COMMAND_DELAY);
      Logger.log(this.messageOnTestStart());
      Logger.log('TestCase=', testCaseToString(this.testCase));

      const result: SeleniumTestResult = await this.execute(this.locator);

      // TODO maybe make this a configuration
      // await this.takeScreenshot(this.getScreenShotFileName());

      result.timeTaken = new Date().getTime() - start;

      Logger.log('TestResult=', testResultToString(result));
      Logger.log(this.messageOnTestComplete());
      return result;
    } catch (error) {
      Logger.error(error);
      const result = getExceptionOccuredTestResult(
        this.testCase,
        error as Error
      );
      return result;
    }
  }

  protected abstract execute(
    previousLocator: Locator | null
  ): Promise<SeleniumTestResult>;
}

export default SeleniumBaseCommand;
