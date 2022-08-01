import * as fs from 'fs';
import Logger from '../logger';
import TestResult from './models/TestResult';

function saveBase64StringAsImage(base64: string, fileName: string): void {
  fs.writeFile(fileName, base64, { encoding: 'base64' }, function (err) {
    if (err) {
      Logger.error(`Cannot save file named :${fileName}`);
      throw err;
    } else {
      Logger.log(`Save successful for file :${fileName}`);
    }
  });
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

 function testResultToString(result: TestResult) {
  const {
    testCase,
    status,
    errorMessage,
    outerHTML,
    timeTaken,
    stackTrace,
    screenshot,
  } = result;

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
    testCase: {
      rowNumber,
      testCaseId,
      label,
      command,
      parameterType,
      parameter,
      expectedResult,
    },
    status,
    errorMessage,
    outerHTML,
    timeTaken,
    stackTrace,
    screenshot,
  };

  return JSON.stringify(obj, null, '  ');
}

export { saveBase64StringAsImage, delay, testResultToString };
