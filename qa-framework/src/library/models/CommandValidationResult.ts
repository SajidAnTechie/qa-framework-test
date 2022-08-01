import { Testcase } from './TestCaseResponse';

type CommandValidationResult = {
  isValid: boolean;
  errorMessage?: string | null;
  testCase: Testcase;
};

export default CommandValidationResult;
