import { Testcase } from '../library/models/TestCaseResponse';
import TestStatus from '../library/models/TestStatus';
import SeleniumTestResult from './SeleniumTestResult';

function getExceptionOccuredTestResult(
  testCase: Testcase,
  error: Error
): SeleniumTestResult {
  return {
    testCase,
    status: TestStatus.Fail,
    outerHTML: '',
    errorMessage: error.message,
    screenshot: '',
    stackTrace: error.stack,
    timeTaken: 0,
    locator: null,
  };
}

export default getExceptionOccuredTestResult;
