import * as Joi from 'joi';
import { Locator, ThenableWebDriver } from 'selenium-webdriver';
import Command from '../../../library/models/Command';
import { Sheet, Testcase } from '../../../library/models/TestCaseResponse';
import TestStatus from '../../../library/models/TestStatus';
import Logger from '../../../logger';
import SeleniumBaseCommand from '../../SeleniumBaseCommand';
import SeleniumTestResult from '../../SeleniumTestResult';

class CmdFunction extends SeleniumBaseCommand {
  getSchema(): Joi.ObjectSchema {
    return Joi.object({
      command: Joi.string().valid(Command.Function).required(),
      parameter: Joi.string().required(),
    }).options({ allowUnknown: true });
  }
  functionCommands: SeleniumBaseCommand[];

  constructor(
    testCase: Testcase,
    sheet: Sheet,
    driver: ThenableWebDriver,
    commands: SeleniumBaseCommand[]
  ) {
    super(testCase, sheet, driver);
    this.functionCommands = commands;
  }

  protected async execute(
    previousLocator: Locator | null
  ): Promise<SeleniumTestResult> {
    if (this.functionCommands === null) {
      return {
        locator: null,
        status: TestStatus.Fail,
        testCase: this.testCase,
        errorMessage:
          'A function cannot be null and should have atleast 1 command',
      };
    }
    const functionResults: SeleniumTestResult[] = [];
    for (const command of this.functionCommands) {
      try {
        command.setLocator(previousLocator);
        const result: SeleniumTestResult = await command.executeTest();
        previousLocator = result.locator;
        functionResults.push(result);
      } catch (err) {
        Logger.error(err);
        return {
          locator: null,
          status: TestStatus.Fail,
          testCase: this.testCase,
          errorMessage: String(err),
        };
      }
    }

    return {
      locator: previousLocator,
      status: TestStatus.Pass,
      testCase: this.testCase,
      errorMessage: "",
    };
  }
}

export default CmdFunction;
