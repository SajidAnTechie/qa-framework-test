/* eslint-disable @typescript-eslint/no-unused-vars */

import { TestCaseResponse } from '../src/library/models/TestCaseResponse';
import automatedTestWebsiteSample from './automatedTestWebsiteSample';
import reducedAutomatedTestWebsiteSample from './reducedautomatedTestWebsiteSample';

function getTestCases(): Promise<TestCaseResponse> {
  return Promise.resolve( automatedTestWebsiteSample as TestCaseResponse);
  //return Promise.resolve(reducedAutomatedTestWebsiteSample as TestCaseResponse);
}

export default getTestCases;
