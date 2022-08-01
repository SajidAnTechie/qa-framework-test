import { Locator, ThenableWebDriver } from 'selenium-webdriver';
import { Driver } from 'selenium-webdriver/chrome';
import { Testcase } from '../../../library/models/TestCaseResponse';
import TestStatus from '../../../library/models/TestStatus';
import SeleniumTestResult from '../../SeleniumTestResult';

class AssertDropdownSelectedValue {
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
    if (this.locator == null) {
      throw new Error('Assert attribute failed. Locator is null.');
    }
    const { parameter, expectedResult } = this.testCase;
    const element = await this.driver.findElement(this.locator);
    const actual = await this.driver.executeScript(
      `
      let element = arguments[0];
      console.log(element);
      if(element.selectedIndex < 0) {
        return "";
      }
      const selected =  element.options[element.selectedIndex].text;
      console.log('selected', selected);
      return selected;
      `,
       element);

    const passed = actual + "" === expectedResult + "";
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

export default AssertDropdownSelectedValue;
