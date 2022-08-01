import getTestCases from '../temporaryFiles/sample';
import { Sheet } from './library/models/TestCaseResponse';
import TestResult from './library/models/TestResult';
import TestStatistics from './library/models/TestStatistics';
import SeleniumTestEngine from './selenium/SeleniumTestEngine';

async function executeTest() {
  const response = await getTestCases();
  const engine = new SeleniumTestEngine(response);
  engine.onSingleTestCompleteCallback = singleTestComplete;
  engine.onAllTestsCompleteCallback = allTestsComplete;
  engine.executeTestCases();
}

function singleTestComplete(result: TestResult, sheet: Sheet) {
  console.log(
    'single test complete callback triggered'
  );
}

function allTestsComplete(stats: TestStatistics, sheet: Sheet) {
  console.log(
    'all tests completed callback triggered'
  );
}

executeTest();
