import { ObjectSchema } from 'joi';
import Joi = require('joi');
import { Locator } from 'selenium-webdriver';
import Command from '../../library/models/Command';
import TestStatus from '../../library/models/TestStatus';
import SeleniumBaseCommand from '../SeleniumBaseCommand';
import SeleniumTestResult from '../SeleniumTestResult';

class Javascript extends SeleniumBaseCommand {
  getSchema(): ObjectSchema {
    return Joi.object({
      command: Joi.string().valid(Command.Javascript).required(),
      parameter: Joi.string().not('').required(),
    }).options({ allowUnknown: true });
  }

  protected async execute(
    previousLocator: Locator | null
  ): Promise<SeleniumTestResult> {
    const actual = await this.driver.executeScript(this.testCase.parameter);
    return {
      status: TestStatus.Pass,
      errorMessage: '',
      testCase: this.testCase,
      locator: previousLocator,
      outerHTML: '',
    };
  }
}

export default Javascript;
