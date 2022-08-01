import { ThenableWebDriver } from 'selenium-webdriver';

import Type from './Type';
import Wait from './Wait';
import Click from './Click';
import MultiRun from './MultiRun';
import IframeEnd from './iframe/IframeEnd';
import Javascript from './Javascript';
import IframeStart from './iframe/IframeStart';
import Selector from './select/Selector';
import VisitCommand from './VisitCommand';
import AssertEquals from './assert/AssertEquals';
import Command from '../../library/models/Command';
import CmdFunction from './cmdFunction/CmdFunction';
import SeleniumBaseCommand from '../SeleniumBaseCommand';
import {
  Sheet,
  Testcase,
  TestCaseResponse,
} from '../../library/models/TestCaseResponse';

function getCommand(
  response: TestCaseResponse,
  testCase: Testcase,
  sheet: Sheet,
  driver: ThenableWebDriver
): SeleniumBaseCommand {
  const { command } = testCase;
  switch (command) {
    case Command.Visit:
      return new VisitCommand(testCase, sheet, driver);
    case Command.AssertEquals:
      return new AssertEquals(testCase, sheet, driver);
    case Command.Select:
      return new Selector(testCase, sheet, driver);
    case Command.Type:
      return new Type(testCase, sheet, driver);
    case Command.Click:
      return new Click(testCase, sheet, driver);
    case Command.MultiRun:
      return new MultiRun(testCase, sheet, driver);
    case Command.IframeStart:
      return new IframeStart(testCase, sheet, driver);
    case Command.IframeEnd:
      return new IframeEnd(testCase, sheet, driver);
    case Command.WaitUntil:
      return new Wait(testCase, sheet, driver);
    case Command.Javascript:
      return new Javascript(testCase, sheet, driver);
    case Command.Function:
      return getFunctionCommand(response, testCase, sheet, driver);
    default:
      throw new Error(`Command type ${command} is not implemented`);
  }
}

function getFunctionCommand(response: TestCaseResponse, testCase: Testcase,
  sheet: Sheet,
  driver: ThenableWebDriver): CmdFunction {
  const { reusables } = response;
  const { parameter } = testCase;

  const commandsTestcases = reusables.filter(r => r.functionName === parameter);

  const commands = commandsTestcases.map(t => getCommand(response, t, response.sheet, driver));

  return new CmdFunction(testCase, sheet, driver, commands);
}

function generateCommands(
  response: TestCaseResponse,
  driver: ThenableWebDriver
): SeleniumBaseCommand[] {
  const { testcases } = response;
  const commands = testcases.map(t => getCommand(response, t, response.sheet, driver));
  return commands;
}

export default generateCommands;
