import { ObjectSchema } from 'joi';
import Joi = require('joi');
import { By, Key, Locator, WebElement } from 'selenium-webdriver';
import Command from '../../library/models/Command';
import ParameterType from '../../library/models/ParameterType';
import TestStatus from '../../library/models/TestStatus';
import SeleniumBaseCommand from '../SeleniumBaseCommand';
import SeleniumTestResult from '../SeleniumTestResult';

class Type extends SeleniumBaseCommand {
  getSchema(): ObjectSchema {
    return Joi.object({
      command: Joi.string().valid(Command.Type).required(),
      parameterType: Joi.string()
        .valid(ParameterType.Text, ParameterType.Tab, ParameterType.Enter, ParameterType.Clear)
        .required(),
      parameter: Joi.when('parameterType', {
        is: Joi.string().valid(ParameterType.Enter, ParameterType.Tab, ParameterType.Clear),
        then: Joi.string().valid(''),
        otherwise: Joi.string().not(''),
      }),
    }).options({ allowUnknown: true });
  }

  protected async execute(
    previousLocator: Locator | null
  ): Promise<SeleniumTestResult> {
    const { parameterType } = this.testCase;
    if (!previousLocator) {
      throw new Error(
        `${Command.Type} should be preceeded by a ${Command.Select}. The locator is null probably issues in excel file.`
      );
    }
    const element = await this.driver.findElement(previousLocator);
    switch (parameterType) {
      case ParameterType.Text:
        return this.processTextInput(element, previousLocator);
      case ParameterType.Enter:
        return this.processEnterKey(element, previousLocator);
      case ParameterType.Tab:
        return this.processTabKey(element);
      case ParameterType.Clear:
        return this.processClearCommand(element, previousLocator);
      default:
        throw new Error(`Parameter type ${parameterType} is not implemented.`);
    }
  }

  // There is a clear command in selenium element.clear().
  // This function just clears the value attribute of <input> element directly on the DOM
  // However, if the website is created in react, the html is updated via react states so clear() 
  // function will clear value from DOM and react will add it back again.
  // To avoid this state, we are getting the current value and then sending backspace key event in a loop
  // Also sending new text "" will not work here to clear the element because selenium appends text to
  // previous value.
  private async processClearCommand(
    element: WebElement, locator: Locator
  ): Promise<SeleniumTestResult> {
    const currentText = await element.getAttribute('value');
    
    if(currentText) {
      for(let i = 0; i < currentText.length; i++) {
        await element.sendKeys(Key.BACK_SPACE);
      }
    }
    
    const outerHTML = await element.getAttribute('outerHTML');

    return {
      status: TestStatus.Pass,
      testCase: this.testCase,
      locator: locator,
      outerHTML,
    };
  }

  // we need to return new selector when we tab so that further assertions and navigation work well
  private async processTabKey(
    element: WebElement
  ): Promise<SeleniumTestResult> {
    await element.sendKeys(Key.TAB);
    const outerHTML = await element.getAttribute('outerHTML');
    const newElementXpath = await this.driver
      .switchTo()
      .activeElement()
      .getAttribute('xpath');

    return {
      status: TestStatus.Pass,
      testCase: this.testCase,
      locator: By.xpath(newElementXpath),
      outerHTML,
    };
  }

  private async processEnterKey(
    element: WebElement,
    locator: Locator
  ): Promise<SeleniumTestResult> {
    await element.sendKeys(Key.ENTER);
    const outerHTML = await element.getAttribute('outerHTML');
    return {
      status: TestStatus.Pass,
      testCase: this.testCase,
      locator,
      outerHTML,
    };
  }

  private async processTextInput(
    element: WebElement,
    locator: Locator
  ): Promise<SeleniumTestResult> {
    const { parameter } = this.testCase;
    await element.sendKeys(parameter);
    const outerHTML = await element.getAttribute('outerHTML');
    return {
      status: TestStatus.Pass,
      testCase: this.testCase,
      locator,
      outerHTML,
    };
  }
}

export default Type;
