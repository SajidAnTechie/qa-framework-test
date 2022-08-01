const responseCodes = require("../constants/responseCodes");
const { getLogsKey } = require('../redisDb/redisClient');
const { LOG_LIMIT } = require("../validators/logsValidator");
const logsService = require("../services/logsService");

/**
 * Find logs by sheetId.
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
*/
async function fetchLogs(req, res, next) {
  try {
    const { sheetId, count } = req.params;
    const key = getLogsKey(sheetId);
    
    const start = 0;
    const end = count === 'all' ? LOG_LIMIT : parseInt(count) - 1; // because index starts from 0
  
    const logs = await logsService.getLogs(key, start, end);
    const orderedLogs = logs.reverse();
    const status = responseCodes.ok;
  
    res.json({
      code: status.code,
      message: status.message,
      data: orderedLogs,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Create logs.
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
*/
async function addLogs(req, res) {
  try {
    const { sheetId } = req.params;
    const { logs } = req.body;
  
    const key = getLogsKey(sheetId); 
  
    await logsService.addLogs(key, logs);
  
    const status = responseCodes.ok;
  
    res.json({
      code: status.code,
      message: 'Added new logs successfully.',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Clear logs by sheetId.
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
*/
async function clearLogs(req, res) {
  try {
    const { sheetId } = req.params;

    const key = getLogsKey(sheetId); 
  
    await logsService.clearLogs(key);
  
    const status = responseCodes.ok;
  
    res.json({
      code: status.code,
      message: 'All logs cleared.',
    }); 
  } catch (err) {
    next(err);
  }
}

module.exports = { 
  fetchLogs, 
  addLogs, 
  clearLogs 
};