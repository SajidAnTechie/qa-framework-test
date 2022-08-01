import Command from './Command';
import ParameterType from './ParameterType';

export type TestCaseResponse = {
  sheet: Sheet;
  configurations: Configuration[];
  reusables: Reusable[];
  testcases: Testcase[];
};

export type Sheet = {
  sheetId: string,
  sheetName: string,
  pageId: string,
  pageName: string,
}

export type Testcase = {
  rowNumber: number;
  testCaseId: string;
  step: string;
  label: string;
  parameter: string;
  parameterType: ParameterType;
  command: Command;
  expectedResult: string;
};

export type Configuration = {
  command: string;
  key: string;
  value: string | number;
};

export type Reusable = Testcase & {
  functionName: string;
};

export function testCaseToString(testCase: Testcase) {
  const {
    rowNumber,
    testCaseId,
    label,
    command,
    parameterType,
    parameter,
    expectedResult,
  } = testCase;
  const obj = {
    rowNumber,
    testCaseId,
    label,
    command,
    parameterType,
    parameter,
    expectedResult,
  };

  return JSON.stringify(obj, null, '  ');
}
