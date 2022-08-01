/* eslint-disable no-console, @typescript-eslint/no-explicit-any */

import { onLogReceived } from '../library/BaseTestEngine';
import { Testcase, testCaseToString } from '../library/models/TestCaseResponse';

export default class Logger {
  static listener: onLogReceived | null;
  static sheetId: string | null;

  public static setListener(listener: onLogReceived, sheetId: string) {
    Logger.listener = listener;
    Logger.sheetId = sheetId;
  }

  public static log(...args: any[]) {
    for (const l of args) {
      console.log(l);
      if(Logger.listener != null && this.sheetId != null) {
        Logger.listener(l, this.sheetId);
      }
    }
  }

  public static logCommand(testCase: Testcase) {
    const log = testCaseToString(testCase);
    Logger.log(log);
  }

  public static logSuccess(testCase: Testcase) {
    Logger.log('Command Executed Successully', testCaseToString(testCase));
  }

  public static logFailure(testCase: Testcase) {
    Logger.log('Command Execution Failed', testCaseToString(testCase));
  }

  public static logAssertionFailed(
    testCase: Testcase,
    expected: string,
    actual: string
  ) {
    Logger.log(
      'Command Execution Failed',
      'Expected=',
      expected,
      'Actual=',
      actual,
      testCaseToString(testCase)
    );
  }

  public static error(...args: any[]) {
    Logger.log(...args);
  }
}
