import { By, Locator } from 'selenium-webdriver';
import ParameterType from '../../../library/models/ParameterType';
import { Testcase } from '../../../library/models/TestCaseResponse';

function getLocator(testCase: Testcase): Locator {
  const { parameterType, parameter } = testCase;
  switch (parameterType) {
    case ParameterType.Text: {
      const xPathString = `//*[ text() = '${parameter}' ]`;
      return By.xpath(xPathString);
    }
    case ParameterType.XPath:
      return By.xpath(parameter);
    case ParameterType.CSS:
      return By.css(parameter);
    default:
      throw new Error(`Parameter type ${parameterType} is not implemented.`);
  }
}

export { getLocator };
