import { Locator, ThenableWebDriver } from 'selenium-webdriver';
import { Driver } from 'selenium-webdriver/chrome';
import { Testcase } from '../../../library/models/TestCaseResponse';
import TestStatus from '../../../library/models/TestStatus';
import SeleniumTestResult from '../../SeleniumTestResult';

class AssertURL {
  testCase: Testcase;

  driver: Driver;

  locator: Locator | null;

  constructor(
    testCase: Testcase,
    driver: ThenableWebDriver,
    locator: Locator | null
  ) {
    this.testCase = testCase;
    this.driver = driver;
    this.locator = locator;
  }

  async assert(): Promise<SeleniumTestResult> {
    const { expectedResult } = this.testCase;
    const actual = await this.driver.getCurrentUrl();
    const passed = actual === expectedResult;
    const errorMessage = passed
      ? ''
      : `Assertion failed: Expected=${expectedResult} Actual=${actual}`;
    return {
      status: passed ? TestStatus.Pass : TestStatus.Fail,
      testCase: this.testCase,
      errorMessage,
      locator: this.locator,
    };
  }
}

export default AssertURL;
