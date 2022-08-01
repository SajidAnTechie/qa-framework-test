const responseCodes = require("../constants/responseCodes");
const testExecutionStatus = require("../constants/testExecutionStatus");
const {
  redisClient,
  getTestExecutionKey,
  getTestResultKey,
  getLogsKey
} = require("../redisDb/redisClient");

const QUEUE_CHANNEL = 'test-action-queue';

const redisHashKeys = {
  totalCases: "totalCases",
  originalRequest: "originalRequest",
  status: "status",
  testsPassed: "testsPassed",
  testsFailed: "testsFailed",
};

function getStatus(sheetId, pageId) {
  const key = getTestExecutionKey(sheetId, pageId);
  return redisClient.hGet(key, redisHashKeys.status);
}

function setStatus(sheetId, pageId, status) {
  const key = getTestExecutionKey(sheetId, pageId);
  return redisClient.hSet(key, redisHashKeys.status, status);
}

async function get(sheetId, pageId) {
  const testExecutionKey = getTestExecutionKey(sheetId, pageId);
  const testResultsKey = getTestResultKey(sheetId, pageId);

  const test = await redisClient.hGetAll(testExecutionKey);
  const testResults = await redisClient.lRange(testResultsKey, 0, -1);
  return { test, ...{ results: testResults } };
}

async function getAllTest(data) {
  const getResults = data.map(testCase => {
    const { sheetId, pageId } = testCase;

    return get(sheetId, pageId);
  });

  const results = await Promise.all(getResults);

  return results.reduce((acc, curr) => [...acc, { ...curr }], []);
}

async function queueTest(testBody) {
  const {
    sheet: { sheetId, pageId },
    testcases,
  } = testBody;
  const testExecutionKey = getTestExecutionKey(sheetId, pageId);
  try {
    // delete old data and then replace with new data from client
    const deleteHashPromises = Object.keys(redisHashKeys).map(k => redisClient.del(testExecutionKey, k));
    await Promise.all(deleteHashPromises);

    const testResultKey = getTestResultKey(sheetId, pageId);
    await redisClient.del(testResultKey);

    // update hash data
    const testBodyJSON = JSON.stringify(testBody);

    await Promise.all([
      redisClient.hSet(testExecutionKey, "status", testExecutionStatus.queued),
      redisClient.hSet(testExecutionKey, "totalCases", testcases.length),
      redisClient.hSet(testExecutionKey, "testsPassed", 0),
      redisClient.hSet(testExecutionKey, "testsFailed", 0),
      redisClient.hSet(testExecutionKey, "originalRequest", testBodyJSON)
    ]);

    // publish to queue channel
    await redisClient.publish(QUEUE_CHANNEL, testBodyJSON);

    return responseCodes.ok;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function queueAllTest(testCases) {
  //delete all running or queue test cases.
  const oldTestCasesPromises = testCases.map((testCase) => {
    const { sheet: { sheetId, pageId } } = testCase;

    return deleteSheetData(sheetId, pageId);
  });

  await Promise.all(oldTestCasesPromises);

  //queue all test cases.
  const queueTestCases = testCases.map((testCase) => queueTest(testCase));

  await Promise.all(queueTestCases);

  return responseCodes.ok;
}

function deleteSheetData(sheetId, pageId) {
  const testExecutionKey = getTestExecutionKey(sheetId, pageId);
  const testResultsKey = getTestResultKey(sheetId, pageId);
  const logsKey = getLogsKey(sheetId);

  const promises = [
    redisClient.del(testExecutionKey),
    redisClient.del(testResultsKey),
    redisClient.del(logsKey),
  ];

  return Promise.all(promises);
}

module.exports = {
  getStatus,
  queueTest,
  redisHashKeys,
  get,
  setStatus,
  deleteSheetData,
  queueAllTest,
  getAllTest
};
