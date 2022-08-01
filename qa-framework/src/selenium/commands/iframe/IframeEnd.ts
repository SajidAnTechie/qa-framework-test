import Joi = require('joi');
import { ObjectSchema } from 'joi';
import { Locator } from 'selenium-webdriver';
import Command from '../../../library/models/Command';
import SeleniumTestResult from '../../SeleniumTestResult';
import TestStatus from '../../../library/models/TestStatus';
import SeleniumBaseCommand from '../../SeleniumBaseCommand';

class IframeEnd extends SeleniumBaseCommand {
    getSchema(): ObjectSchema {
        return Joi.object({
            command: Joi.string().valid(Command.IframeEnd).required(),
            parameter: Joi.any().optional(),
        }).options({ allowUnknown: true });
    }

    protected async execute(
        previousLocator: Locator | null
    ): Promise<SeleniumTestResult> {
        await this.driver.switchTo().defaultContent();

        return {
            status: TestStatus.Pass,
            errorMessage: '',
            testCase: this.testCase,
            locator: null
        };
    }
}

export default IframeEnd;
