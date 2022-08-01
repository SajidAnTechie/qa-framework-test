/* eslint-disable no-await-in-loop */
import Logger from '../logger';
import BaseCommand from './BaseCommand';
import TestResult from './models/TestResult';
import TestStatus from './models/TestStatus';
import TestStatistics from './models/TestStatistics';
import { Sheet, TestCaseResponse } from './models/TestCaseResponse';
import CommandValidationResult from './models/CommandValidationResult';

type onSingleTestComplete = (result: TestResult, sheet: Sheet) => void;
type onAllTestsComplete = (stats: TestStatistics, sheet: Sheet) => void;
type onTestExecutionStarted = (sheet: Sheet) => void;
export type onLogReceived = (log: string, sheetId: string) => void;

abstract class BaseTestEngine {
  testCaseResponse: TestCaseResponse;
  onSingleTestCompleteCallback: onSingleTestComplete | null;
  onAllTestsCompleteCallback: onAllTestsComplete | null;
  onTestExecutionStartedCallback: onTestExecutionStarted | null;
  onLogReceived: onLogReceived | null; 

  constructor(testCaseResponse: TestCaseResponse) {
    this.testCaseResponse = testCaseResponse;
    this.onSingleTestCompleteCallback = null;
    this.onAllTestsCompleteCallback = null;
    this.onTestExecutionStartedCallback = null;
    this.onLogReceived = null;
  }

  public setOnLogReceivedListener(listener: onLogReceived) {
    this.onLogReceived = listener;
    const { sheetId } = this.testCaseResponse.sheet;
    Logger.setListener(listener, sheetId);
  }

  protected onAllTestsFinished(results: TestResult[]) {
    Logger.log(
      '-------------------Test Results Start---------------------------'
    );
    const stats = this.getTestStats(results);
    if(this.onAllTestsCompleteCallback != null) {
      this.onAllTestsCompleteCallback(stats, this.testCaseResponse.sheet);
    }
    const { total, passed, failed, timeTaken } = stats;
    Logger.log(`${total} Tests Executed`);
    Logger.log(`${passed} Tests Passed`);
    Logger.log(`${failed} Tests Failed`);
    Logger.log(`Took ${timeTaken} seconds to complete.`);
    Logger.log(
      '-------------------Test Results End-----------------------------'
    );
  }

  private getTestStats(results: TestResult[]): TestStatistics {
    const total = this.testCaseResponse.testcases.length;
    const passed = results.reduce(
      (acc, result) => (result.status === TestStatus.Pass ? acc + 1 : acc),
      0
    );
    const totalMilliseconds = results.reduce(
      (acc, result) => (acc + (result.timeTaken ?? 0) ),
      0
    );
    const timeTaken = Math.round(totalMilliseconds / 1000);
    const failed = total - passed;

    return {total, passed, failed, timeTaken};
  }

  async validateCommands(): Promise<boolean> {
    const failures = await this.getCommandWithValidationFailures();
    if (failures.length !== 0) {
      Logger.error(
        'There are some mismatch in your excel file data. Please review the errors below.'
      );
      Logger.error(JSON.stringify(failures));
      return false;
    }
    return true;
  }

  protected onSingleTestFinished(result: TestResult) {
    if(this.onSingleTestCompleteCallback != null) {
      this.onSingleTestCompleteCallback(result, this.testCaseResponse.sheet);
    }
  }

  private async getCommandWithValidationFailures(): Promise<
    CommandValidationResult[]
  > {
    const commands = this.getAllCommands();
    const validationPromises = commands.map(c => c.isValid());
    const result = await Promise.all(validationPromises);

    return result.filter(r => r.isValid === false);
  }

  protected onTestStarted() {
    if(!this.onTestExecutionStartedCallback) {
      return;
    }
    this.onTestExecutionStartedCallback(this.testCaseResponse.sheet);
  }

  protected abstract getAllCommands(): BaseCommand[];
  protected abstract allTestsCompleted(): void;
  abstract executeTestCases(): void;
}

export default BaseTestEngine;
