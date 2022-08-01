import { Locator } from 'selenium-webdriver';
import TestResult from '../library/models/TestResult';

type SeleniumTestResult = TestResult & {
  locator: Locator | null;
};

export default SeleniumTestResult;
