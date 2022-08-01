import { ObjectSchema } from 'joi';
import Joi = require('joi');
import { Locator } from 'selenium-webdriver';
import Command from '../../../library/models/Command';
import ParameterType from '../../../library/models/ParameterType';
import TestStatus from '../../../library/models/TestStatus';
import SeleniumBaseCommand from '../../SeleniumBaseCommand';
import SeleniumTestResult from '../../SeleniumTestResult';
import { getLocator } from './selectorUtil';

class Selector extends SeleniumBaseCommand {
  getSchema(): ObjectSchema {
    return Joi.object({
      command: Joi.string().valid(Command.Select).required(),
      parameterType: Joi.string()
        .valid(ParameterType.XPath, ParameterType.Text, ParameterType.CSS)
        .required(),
      parameter: Joi.string().not('').required(),
    }).options({ allowUnknown: true });
  }

  protected async execute(
    previousLocator: Locator | null
  ): Promise<SeleniumTestResult> {
    const locator = getLocator(this.testCase);
    return this.validateSelection(locator);
  }

  private async validateSelection(
    locator: Locator
  ): Promise<SeleniumTestResult> {
    const element = await this.driver.findElement(locator);
    const outerHTML = await element.getAttribute('outerHTML');

    return {
      status: TestStatus.Pass,
      errorMessage: '',
      testCase: this.testCase,
      locator,
      outerHTML,
    };
  }
}

export default Selector;
