const redis = require('redis');

const responseCodes = require("../constants/responseCodes");
const { redisClient, getTestExecutionKey, getTestResultKey } = require('../redisDb/redisClient');
const { redisHashKeys } = require('../services/testService');

const TEST_STATUS = {
  Pass: 'Pass',
  Fail: 'Fail',
}

/**
 * Get test result by sheetId and pageId.
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
*/
async function testResult(req, res, next) {
  try {
    const {  sheetId, pageId, testResult } = req.body;
    const testExecutionKey = getTestExecutionKey(sheetId, pageId);
    const exists = await redisClient.exists(testExecutionKey);
    if(exists !== 1) {
      // means there is no key in our db
      const status = responseCodes.badRequest;
      res.json({
        code: status.code,
        message: 'Invalid inputs.',
        data: status,
      });
      return;
    }
  
    const testResultStatus = testResult.status;
    const testResultKey = getTestResultKey(sheetId, pageId);
    await redisClient.rPush(testResultKey, JSON.stringify(testResult));
    
    if(testResultStatus === TEST_STATUS.Pass) {
      await redisClient.hIncrBy(testExecutionKey, redisHashKeys.testsPassed, 1);
    } else {
      await redisClient.hIncrBy(testExecutionKey, redisHashKeys.testsFailed, 1);
    }
  
    const status = responseCodes.ok;
    res.json({
      code: status.code,
      message: 'Recorded successfully.',
    });
  } catch (err) {
    next(err);
  }
}

module.exports = testResult;