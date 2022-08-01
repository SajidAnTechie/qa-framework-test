import { Driver } from 'selenium-webdriver/chrome';
import SeleniumTestResult from '../../SeleniumTestResult';
import TestStatus from '../../../library/models/TestStatus';
import { Locator, ThenableWebDriver } from 'selenium-webdriver';
import ParameterType from '../../../library/models/ParameterType';
import { Testcase } from '../../../library/models/TestCaseResponse';

class AssertComparison {
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
    
    const { parameterType, expectedResult } = this.testCase;
    const element = await this.driver.findElement(this.locator);
    const actual = await element.getText();

    const passed = this.checkIfTestIsPassed(actual, expectedResult, parameterType);

    return {
      status: passed ? TestStatus.Pass : TestStatus.Fail,
      testCase: this.testCase,
      errorMessage: passed ? '': `Assertion failed: Expected=${expectedResult} Actual=${actual}`,
      locator: this.locator,
    };
  }

  private checkIfTestIsPassed(
    actual: string, 
    expectedResult: string, 
    parameterType: string
  ): Boolean {
    switch (parameterType) {
      case ParameterType.AssertContains:
        return actual.indexOf(expectedResult) >= 0;
      case ParameterType.AssertStartsWith:
        return actual.startsWith(expectedResult);
      case ParameterType.AssertEndsWith:
        return actual.endsWith(expectedResult);
      case ParameterType.AssertGreaterThan:
      case ParameterType.AssertEndsWith:
        const actualNumber = parseInt(actual);
        const expectedResultNumber = parseInt(expectedResult);

        if(isNaN(expectedResultNumber) || isNaN(actualNumber)) {
            throw new Error(
                `target values should be in integer.`
            );
        }

        if(parameterType === ParameterType.AssertGreaterThan) {
          return expectedResultNumber > actualNumber;
        }

        return expectedResultNumber < actualNumber;
      default:
        return false;
    }
  }
}

export default AssertComparison;
