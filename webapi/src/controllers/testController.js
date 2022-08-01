const redis = require('redis');

const logsService = require('../services/logsService');
const testService = require('../services/testService');
const responseCodes = require("../constants/responseCodes");
const testExecutionStatus = require('../constants/testExecutionStatus');

const {
  getLogsKey
} = require('../redisDb/redisClient');

/**
 * Create a new test case.
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
*/
async function createTests(req, res, next) {
  try {
    const { sheet: { sheetId, pageId } } = req.body;

    const testStatus = await testService.getStatus(sheetId, pageId);

    if (testStatus === testExecutionStatus.alreadyRunning) {
      // let the test complete. return error
      const status = responseCodes.badRequest;// todo
      res.json({
        code: status.code,
        message: `Cannot queue an already running test.`,
      })
      return;
    }

    // delete the logs first
    const logKey = getLogsKey(sheetId);
    await logsService.clearLogs(logKey);
    // for completed and queued, we update the db with new testcase. Ignore previous result
    const data = await testService.queueTest(req.body);

    res.json({
      code: data.code,
      message: data.message,
      data: {
        testStatus: testExecutionStatus.queued,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Create new test cases.
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
*/
async function createAllTest(req, res, next) {
  try {
    const data = await testService.queueAllTest(req.body);

    res.json({
      code: data.code,
      message: data.message,
      data: {
        testStatus: testExecutionStatus.queued,
      },
    });
  } catch (err) {
    next(err)
  }
}

/**
 * Find test case by sheetId and pageId.
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
*/
async function getTest(req, res, next) {
  try {
    const { sheetId, pageId } = req.params;

    const test = await testService.get(sheetId, pageId);

    if (!test) {
      const status = responseCodes.notFound;
      res.json({
        code: status.code,
        message: 'No test found.',
      })
      return;
    }

    const status = responseCodes.ok;

    res.json({
      code: status.code,
      message: status.message,
      data: test,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Find all test cases results.
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
*/
async function getAllTest(req, res, next) {
  try {
    const data = await testService.getAllTest(req.body);

    const status = responseCodes.ok;

    res.json({
      code: status.code,
      message: status.message,
      data,
    });
  } catch (err) {
    next(err);
  }
}

function isUploadstatusAllowed(oldStatus, newStatus) {
  const { queued, alreadyRunning, completed } = testExecutionStatus;

  if (oldStatus === queued && newStatus !== alreadyRunning) {
    return false;
  }

  if (oldStatus === alreadyRunning && newStatus !== completed) {
    return false;
  }

  return true;
}

/**
 * Update test case status by sheetId and pageId.
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
*/
async function updateStatus(req, res, next) {
  try {
    const { status: newStatus } = req.body;
    const { sheetId, pageId } = req.params;
    const oldStatus = await testService.getStatus(sheetId, pageId);

    if (!isUploadstatusAllowed(oldStatus, newStatus)) {
      const errorStatus = responseCodes.badRequest;
      res.json({
        code: errorStatus.code,
        message: `Cannot update status from ${oldStatus} to ${newStatus}.`,
      })
      return;
    }

    await testService.setStatus(sheetId, pageId, newStatus);

    const okStatus = responseCodes.ok;

    res.json({
      code: okStatus.code,
      message: `Updated status from ${oldStatus} to ${newStatus}.`,
    });
  } catch (err) {
    next(err)
  }
}

/**
 * Remove test case by sheetId and pageId.
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
*/
async function deleteTest(req, res, next) {
  try {
    const { sheetId, pageId } = req.params;

    await testService.deleteSheetData(sheetId, pageId);

    const okStatus = responseCodes.ok;

    res.json({
      code: okStatus.code,
      message: `Removed all data for sheet ${sheetId}`,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createTests,
  getTest,
  updateStatus,
  deleteTest,
  createAllTest,
  getAllTest
};