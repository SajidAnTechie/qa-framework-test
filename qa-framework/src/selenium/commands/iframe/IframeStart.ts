import Selector from '../select/Selector';
import Command from '../../../library/models/Command';
import SeleniumTestResult from '../../SeleniumTestResult';
import { ThenableWebDriver, By } from 'selenium-webdriver';
import { Sheet, Testcase } from '../../../library/models/TestCaseResponse';

class IframeStart extends Selector {
    constructor(testCase: Testcase, sheet: Sheet, driver: ThenableWebDriver) {
        const newTestCase = { ...testCase, ...{ command: Command.Select } };
        super(newTestCase, sheet, driver);
    }

    async executeTest(): Promise<SeleniumTestResult> {
        const result = await super.executeTest();
        const { locator } = result;

        if (!locator) {
            throw new Error(
                `Couldn't select the element to click. Do you have correct selectors setup.?`
            );
        }
        const iframe = await this.driver.findElement(locator);

        // Switch to the frame
        await this.driver.switchTo().frame(iframe);

        return result;
    }
}

export default IframeStart;
