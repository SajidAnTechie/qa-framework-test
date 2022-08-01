import Selector from './select/Selector';
import Command from '../../library/models/Command';
import SeleniumTestResult from '../SeleniumTestResult';
import { ThenableWebDriver, By } from 'selenium-webdriver';
import { Sheet, Testcase } from '../../library/models/TestCaseResponse';

class MultiRun extends Selector {
  constructor(testCase: Testcase, sheet: Sheet, driver: ThenableWebDriver) {
    const newTestCase = { ...testCase, ...{ command: Command.Select } };
    super(newTestCase, sheet, driver);
  }

async executeTest(): Promise<SeleniumTestResult> {
  const result = await super.executeTest();
  if (!result.locator) {
      throw new Error(
      `Couldn't select the element to click. Do you have correct selectors setup.?`
      );
  }
  
  const element = await this.driver.findElement(result.locator);

  const [count, targetAttributeName] = await Promise.all([
    element.getAttribute('data-dyn-count'), 
    element.getAttribute('data-dyn-target-name')
  ]);

  const targetCount = parseInt(count);

  if(isNaN(targetCount) || !targetAttributeName) {
      throw new Error(
          `Couldn't find the target attribute to click. Do you have correct selectors setup.?`
      );
  }

  const targetList = [];

  for (let i = 1; i <= targetCount; i++) {
    const targetElement = this.driver.findElement(By.xpath(`//*[@${targetAttributeName}-${i}='${targetAttributeName}-${i}']`)).click();

    targetList.push(targetElement);
  }

  await Promise.all(targetList);

  result.testCase.command = Command.MultiRun;
  
  return result;
  }
}

export default MultiRun;
