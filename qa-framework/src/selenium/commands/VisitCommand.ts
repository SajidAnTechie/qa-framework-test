import * as Joi from 'joi';
import { Locator } from 'selenium-webdriver';
import Command from '../../library/models/Command';
import TestStatus from '../../library/models/TestStatus';
import Logger from '../../logger';
import SeleniumBaseCommand from '../SeleniumBaseCommand';
import SeleniumTestResult from '../SeleniumTestResult';

class VisitCommand extends SeleniumBaseCommand {
  getSchema(): Joi.ObjectSchema {
    return Joi.object({
      command: Joi.string().valid(Command.Visit).required(),
      parameter: Joi.string().uri(),
    }).options({ allowUnknown: true });
  }

  protected async execute(
    previousLocator: Locator | null
  ): Promise<SeleniumTestResult> {
    try {
      await this.driver.get(this.testCase.parameter);

      return {
        locator: null,
        status: TestStatus.Pass,
        testCase: this.testCase,
      };
    } catch (err) {
      Logger.error(err);
      const error = err as Error;
      if (error.name === 'WebDriverError') {
        Logger.error(
          `Could not connect to url ${this.testCase.parameter}. Is the website up and running?`
        );
      }
      return {
        locator: null,
        status: TestStatus.Fail,
        testCase: this.testCase,
        errorMessage: String(err),
      };
    }
  }
}

export default VisitCommand;
