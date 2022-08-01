import * as Joi from 'joi';
import { ObjectSchema } from 'joi';

import TestResult from './models/TestResult';
import { Sheet, Testcase } from './models/TestCaseResponse';
import CommandValidationResult from './models/CommandValidationResult';

abstract class BaseCommand {
  testCase: Testcase;
  sheet: Sheet;

  constructor(testCase: Testcase, sheet: Sheet) {
    this.testCase = testCase;
    this.sheet = sheet;
  }

  protected messageOnTestStart(): string {
    return `Started executing testCase ${this.testCase.rowNumber}`;
  }

  protected messageOnTestComplete(): string {
    return `Finished executing testCase ${this.testCase.rowNumber}`;
  }

  getScreenShotFileName(): string {
    const path = __dirname + '/' + `${this.testCase.command}-${
      this.testCase.rowNumber
    }-${new Date().getTime()}.png`
    console.log('Image path=' + path);
    return path;
  }

  async isValid(): Promise<CommandValidationResult> {
    try {
      const schema = this.getSchema();
      await schema.validateAsync(this.testCase);

      return { isValid: true, testCase: this.testCase };
    } catch (err) {
      if (err instanceof Joi.ValidationError) {
        return {
          isValid: false,
          errorMessage: err.message,
          testCase: this.testCase,
        };
      }
      return {
        isValid: false,
        errorMessage: String(err),
        testCase: this.testCase,
      };
    }
  }

  abstract executeTest(): Promise<TestResult>;
  abstract getSchema(): ObjectSchema;
  abstract takeScreenshot(fileName: string):  Promise<void>;
}

export default BaseCommand;
