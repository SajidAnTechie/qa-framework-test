import { ObjectSchema } from 'joi';
import Joi = require('joi');
import { Locator, until } from 'selenium-webdriver';
import Command from '../../library/models/Command';
import ParameterType from '../../library/models/ParameterType';
import TestStatus from '../../library/models/TestStatus';
import SeleniumBaseCommand from '../SeleniumBaseCommand';
import SeleniumTestResult from '../SeleniumTestResult';
import { getLocator } from './select/selectorUtil';

const DEFAULT_WAIT_TIMEOUT = 45 * 1000;
class Wait extends SeleniumBaseCommand {
  getSchema(): ObjectSchema {
    return Joi.object({
      command: Joi.string().valid(Command.WaitUntil).required(),
      parameterType: Joi.string()
        .valid(
          ParameterType.Text,
          ParameterType.XPath,
          ParameterType.CSS,
          ParameterType.Seconds,
          ParameterType.Milliseconds,
          ParameterType.URL,
          ParameterType.Title,
        )
        .required(),
      parameter: Joi.any().optional(),
    }).options({ allowUnknown: true });
  }

  protected async execute(
    previousLocator: Locator | null
  ): Promise<SeleniumTestResult> {
    const { parameterType } = this.testCase;
    switch (parameterType) {
      case ParameterType.URL:
        return this.processURLWait(previousLocator);
      case ParameterType.Title:
        return this.processTitleWait(previousLocator);
      case ParameterType.Text:
      case ParameterType.CSS:
      case ParameterType.XPath:
        return this.processElementWait(previousLocator);
      case ParameterType.Seconds: {
        const ms = Number(this.testCase.parameter) * 1000;
        return this.processFixedTimeWait(ms, previousLocator);
      }
      case ParameterType.Milliseconds: {
        const ms = Number(this.testCase.parameter) * 1000;
        return this.processFixedTimeWait(ms, previousLocator);
      }
      default:
        throw new Error(`Parameter type ${parameterType} is not implemented.`);
    }
  }

  private async processTitleWait(
    previousLocator: Locator|null
  ): Promise<SeleniumTestResult> {
    const { parameter } = this.testCase;

    await this.driver.wait(until.titleContains(parameter), DEFAULT_WAIT_TIMEOUT);

    return {
      status: TestStatus.Pass,
      testCase: this.testCase,
      locator: previousLocator,
    };
  }

  private async processURLWait(
    previousLocator: Locator|null
  ): Promise<SeleniumTestResult> {
    const { parameter } = this.testCase;
    
    await this.driver.wait(until.urlIs(parameter), DEFAULT_WAIT_TIMEOUT);

    return {
      status: TestStatus.Pass,
      testCase: this.testCase,
      locator: previousLocator,
    };
  }

  private async processFixedTimeWait(
    milliseconds: number,
    previousLocator: Locator|null
  ): Promise<SeleniumTestResult> {
    await this.delay(milliseconds);
    return {
      status: TestStatus.Pass,
      testCase: this.testCase,
      locator: previousLocator,
    };
  }

  private async processElementWait(
    previousLocator: Locator|null
  ): Promise<SeleniumTestResult> {
    const locator = getLocator(this.testCase);

    await this.driver.wait(until.elementLocated(locator), DEFAULT_WAIT_TIMEOUT);

    const element = await this.driver.findElement(locator);
    const outerHTML = await element.getAttribute('outerHTML');

    return {
      status: TestStatus.Pass,
      testCase: this.testCase,
      locator: previousLocator,
      outerHTML,
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }
}

export default Wait;
