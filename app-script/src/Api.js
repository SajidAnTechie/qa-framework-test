// function isServerRunning() {
//   // Check if the server is running
//   try{
//     var response = UrlFetchApp.fetch(API_ENDPOINT);
//     return JSON.parse(response.getContentText())["code"] === 200;
//   }
//   catch {
//     return false
//   }
// }

function startTestApi(testCaseJson) {
  // startTest api
  const { url, options } = getHttpData('/test', 'post', testCaseJson);

  appLog("----/test create test api----");
  appLog(url);
  appLog(options);
  appLog(JSON.stringify(testCaseJson));

  var response = UrlFetchApp.fetch(url, options);

  appLog("response:" + response);
  response_json = JSON.parse(response)
  return response_json["data"];
}

function getStatusApi(sheetInfo) {
  const { sheetId, pageId } = sheetInfo;
  const { url, options } = getHttpData(`/test/sheetId/${sheetId}/pageId/${pageId}`, 'get');

  const response = UrlFetchApp.fetch(url, options);
  appLog("----/test get status api----");
  appLog(url);

  response_json = JSON.parse(response)
  appLog(response);
  return response_json["data"];
}

function getLogs(sheetId) {
  const { url, options } = getHttpData(`/logs/sheetId/${sheetId}/count/all`, 'get');

  appLog("----/logs api----");
  appLog(url);
  appLog(options);

  const response = UrlFetchApp.fetch(url, options);
  appLog(response);

  response_json = JSON.parse(response)
  return response_json["data"];
}

function clearRedisDb(sheet) {
  const { sheetId, pageId } = getSheetInfo(sheet);
  const { url, options } = getHttpData(`/test/sheetId/${sheetId}/pageId/${pageId}`, 'delete');

  const response = UrlFetchApp.fetch(url, options);
  appLog("----/test delete test api----");
  appLog(url);
  appLog(options);
  appLog(response);
}

function startAllTest(testCases) {
  const { url, options } = getHttpData('/test/all', 'post', testCases);

  appLog("----/test create test api----");
  appLog(url);
  appLog(options);
  appLog(JSON.stringify(testCases));

  var response = UrlFetchApp.fetch(url, options);

  appLog("response:" + response);
  response_json = JSON.parse(response);
  return response_json["data"];
}

function getAllTestStatus(sheetInfo) {
  const { url, options } = getHttpData('/test/results/all', 'post', sheetInfo);

  appLog("----/test get test status api----");
  appLog(url);
  appLog(options);
  appLog(JSON.stringify(sheetInfo));

  var response = UrlFetchApp.fetch(url, options);

  appLog("response:" + response);
  response_json = JSON.parse(response);
  return response_json["data"];
}

const apis = {
  startTestApi: startTestApi,
  getStatusApi: getStatusApi,
  startAllTest: startAllTest,
  getLogs: getLogs,
  clearRedisDb: clearRedisDb,
  getAllTestStatus: getAllTestStatus
};

