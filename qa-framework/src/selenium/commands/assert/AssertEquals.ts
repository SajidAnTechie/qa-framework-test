import * as Joi from 'joi';
import AssertURL from './AssertURL';
import AssertTitle from './AssertTitle';
import AssertInnerText from './AssertInnerText';
import AssertAttribute from './AssertAttribute';
import AssertComparison from './AssertComparison';
import Command from '../../../library/models/Command';
import SeleniumTestResult from '../../SeleniumTestResult';
import SeleniumBaseCommand from '../../SeleniumBaseCommand';
import ParameterType from '../../../library/models/ParameterType';
import AssertDropdownSelectedValue from './AssertDropdownSelectedValue';

class AssertEquals extends SeleniumBaseCommand {
  getSchema(): Joi.ObjectSchema {
    return Joi.object({
      expectedResult: Joi.any().allow("").required(),
      command: Joi.string().valid(Command.AssertEquals).required(),
      parameterType: Joi.string()
        .valid(
          ParameterType.Title, 
          ParameterType.Attribute, 
          ParameterType.Text, 
          ParameterType.URL, 
          ParameterType.Dropdown,
          ParameterType.AssertContains,
          ParameterType.AssertStartsWith,
          ParameterType.AssertEndsWith,
          ParameterType.AssertGreaterThan,
          ParameterType.AssertLessThan
          )
        .required(),
      parameter: Joi.any().optional(),
    }).options({ allowUnknown: true });
  }

  protected async execute(): Promise<SeleniumTestResult> {
    const { parameterType } = this.testCase;
    switch (parameterType) {
      case ParameterType.Title:
        return new AssertTitle(
          this.testCase,
          this.driver,
          this.locator
        ).assert();
      case ParameterType.Attribute:
        return new AssertAttribute(
          this.testCase,
          this.driver,
          this.locator
        ).assert();
      case ParameterType.Text:
        return new AssertInnerText(
          this.testCase,
          this.driver,
          this.locator
        ).assert();
      case ParameterType.URL:
        return new AssertURL(
          this.testCase,
          this.driver,
          this.locator
        ).assert();
      case ParameterType.Dropdown:
        return new AssertDropdownSelectedValue(
          this.testCase,
          this.driver,
          this.locator
        ).assert();
      case ParameterType.AssertContains:
      case ParameterType.AssertStartsWith:
      case ParameterType.AssertEndsWith:
      case ParameterType.AssertGreaterThan:
      case ParameterType.AssertLessThan:
        return new AssertComparison(
          this.testCase,
          this.driver,
          this.locator
        ).assert();
      default:
        throw new Error(`Parameter type ${parameterType} is not implemented.`);
    }
  }
}

export default AssertEquals;
