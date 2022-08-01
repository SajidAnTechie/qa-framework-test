import { Testcase } from './TestCaseResponse';
import TestStatus from './TestStatus';

type TestResult = {
  testCase: Testcase;
  status: TestStatus;
  errorMessage?: string | null;
  outerHTML?: string | null;
  timeTaken?: number | null;
  stackTrace?: string | undefined;
  screenshot?: string | null;
};

export default TestResult;
