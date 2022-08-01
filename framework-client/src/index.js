const { SeleniumTestEngine } = require('qa-framework');

const { api } = require('./network');
const redisClient = require('./redisClient');
const { processLog } = require('./loghandler');

const QUEUE_CHANNEL = 'test-action-queue';

const TEST_EXECUTION_STATUS = {
  alreadyRunning: 'Running',
  queued: 'Queued',
  completed: 'Completed',
};

function initRedisListener() {
  console.log('Redis client Init called');
  redisClient.subscribe(QUEUE_CHANNEL, (message, channel) => {
    console.log(`Received message from '${channel}' channel: ${message}`);

    const response = JSON.parse(message);
    executeTest(response);
  });
}

async function executeTest(response) {
  const engine = new SeleniumTestEngine(response);
  // set callbacks
  engine.onSingleTestCompleteCallback = singleTestComplete;
  engine.onAllTestsCompleteCallback = allTestsComplete;
  engine.onTestExecutionStartedCallback = onTestExecutionStarted;
  engine.setOnLogReceivedListener(processLog);
  // start test execution
  engine.executeTestCases();
}

async function singleTestComplete(testResult, sheet) {
  console.log('single test complete callback triggered');
  console.log(testResult);
  const { sheetId, pageId } = sheet;
 
  const request = {
    sheetId,
    pageId,
    testResult: {
      status: testResult.status,
      testCase: testResult.testCase,
      timeTaken: testResult.timeTaken,
      errorMessage: testResult.errorMessage,
      outerHTML: testResult.outerHTML,
      stackTrace: testResult.stackTrace,
      screenshot: testResult.screenshot
    },
  };
  
  const response = await api.post('/result', request);
  console.log('single test complete', response.data);
}

async function allTestsComplete(stats, sheet) {
  const { sheetId, pageId } = sheet;
  const request = {
    status: TEST_EXECUTION_STATUS.completed,
  };
  const url = `/test/sheetId/${sheetId}/pageId/${pageId}`;
  const response = await api.patch(url, request);
  console.log('all test complete response', response.data);
}

async function onTestExecutionStarted(sheet) {
  const { sheetId, pageId } = sheet;
  const request = {
    status: TEST_EXECUTION_STATUS.alreadyRunning,
  };
  const url = `/test/sheetId/${sheetId}/pageId/${pageId}`;
  const response = await api.patch(url, request);
  console.log('onTestExecutionStarted response', response.data);
}

initRedisListener();
