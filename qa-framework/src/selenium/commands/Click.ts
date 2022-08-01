import Selector from './select/Selector';
import Command from '../../library/models/Command';
import { ThenableWebDriver } from 'selenium-webdriver';
import SeleniumTestResult from '../SeleniumTestResult';
import { Sheet, Testcase } from '../../library/models/TestCaseResponse';

// the only difference in commands select and click is we click the selected element so we can reuse the same code
class Click extends Selector {
  constructor(testCase: Testcase, sheet: Sheet, driver: ThenableWebDriver) {
    const newTestCase = { ...testCase, ...{ command: Command.Select } };
    super(newTestCase, sheet, driver);
  }

  async executeTest(): Promise<SeleniumTestResult> {
    const result = await super.executeTest();
    if (!result.locator) {
      throw new Error(
        `Couldn't select the element to click. Do you have correct selectors setup?`
      );
    }
    await this.driver.findElement(result.locator).click();
    result.testCase.command = Command.Click;
    return result;
  }
}

export default Click;
