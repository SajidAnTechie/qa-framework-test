const { api } = require("./network");
/**
 * We only support one log thread per sheet. So if multiple tests of same sheet are run, then the testcases log will overlap
 * We register a periodic interval which if logs are available and api is not running will update the current queued log
 * to our database. This listener is kept as long as the client is up.
 * Running multiple different sheet will not impact the log provided by our api because the logs are segregrated by sheetId.
 * However, same logs viewing in console can be difficult as they overlap.
 */
const LOG_WAIT_TIME = 10 * 1000;
let apiFinishedTime = new Date().getTime();
let apiCallFinished = true;
let logsQueue = [];
let sheetId = null;

function shouldCallApi() {
  if(sheetId === null) {
    return false;
  }

  if (logsQueue.length === 0) {
    return false;
  }

  if (!apiCallFinished) {
    return false;
  }

  let timeDifference = new Date().getTime() - apiFinishedTime;

  if (timeDifference < LOG_WAIT_TIME) {
    return false;
  }

  return true;
}

function processLog(log, kSheetId) {
  logsQueue.push(log);
  sheetId = kSheetId;
}

// set's a periodic interval to update logs in database
// this allows us to send logs that occur before the LOG_WAIT_TIME has elapsed and no 
// subsequent logs are sent
function startLoggingTimer() {
  setInterval(() => {
    checkAndUpdateLogsToDB(sheetId);
  }, LOG_WAIT_TIME);
}

async function checkAndUpdateLogsToDB(sheetId) {
  const callApi = shouldCallApi();
  if (callApi) {
    const logs = [...logsQueue];
    logsQueue = [];
    await updateLogsInDatabase(logs, sheetId);
  }
}

async function updateLogsInDatabase(logs, sheetId) {
  const request = {
    logs: logs,
  };
  const url = `/logs/sheetId/${sheetId}`;
  try {
    apiCallFinished = false;
    const response = await api.patch(url, request);
    console.log("Updated logs to database.", response.data);
    apiCallFinished = true;
    apiFinishedTime = new Date().getTime();
  } catch (error) {
    console.error(error);
    apiCallFinished = true;
    apiFinishedTime = new Date().getTime();
  }
}

startLoggingTimer();

module.exports = { processLog };
