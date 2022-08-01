function setValueToSheet(sheetData) {
  const { sheet, columnName, row, status, dataValues } = sheetData;
  // Update cell content by column name and row number
  // clearSheetValue(sheet, columnName, row);
  let column = dataValues[0].indexOf(columnName); // Gets range for the first row only (i.e. index 0) and then narrows down to the specific column name
  if (column != -1) { // If column is present
    const range = sheet.getRange(row, column + 1, 1, 1); // gets the cell by specifying the row and the column
    range.setValue(status);
  }
}

function clearSheetValue(sheet, columnName, row) {
  // Clear cell content
  let range = getCellRangeByColumnName(sheet, columnName, row);

  range.clearContent();
}

function startTest(testCasesSheet) {
  const testCasesJson = testCasesToJson(testCasesSheet);

  let message = ""
  if (MOCK_API) { // Mock result
    message = mockStartTest();
    return;
  }

  try {
    updateTestStatus(testCasesSheet, testCasesJson.testcases, 'Queued', OUTPUT_STATUS_COLUMN);

    message = apis.startTestApi(testCasesJson);

    return message;

  } catch (err) {
    appLog(err);
    Browser.msgBox(JSON.stringify(err.message), Browser.Buttons.OK);
  }
}

function startCurrentTest() {
  // This function is called from the sheet

  // const confirm=Browser.msgBox("Are you sure you want to run automation test for current sheet?", Browser.Buttons.OK_CANCEL);
  // if(confirm!='ok'){return};
  clearLogsSheet();
  const testCasesSheet = SpreadsheetApp.getActiveSheet();
  const message = startTest(testCasesSheet);

  // openAlertDialog(JSON.stringify(message)); // Show message in alert dialog
}

function startAllTests() {
  const confirm = Browser.msgBox("Are you sure you want to run automation test for all the sheets?", Browser.Buttons.OK_CANCEL);

  if (confirm != 'ok') {
    return;
  };

  clearLogsSheet();
  const allSheets = SpreadsheetApp.getActive().getSheets();
  let sheetsToTest = [];

  for (let sheet in allSheets) {
    const activeSheet = allSheets[sheet];

    if (activeSheet.getName().startsWith("TC-")) {
      const testCasesJson = testCasesToJson(activeSheet);
      sheetsToTest.push(testCasesJson);
      updateTestStatus(activeSheet, testCasesJson.testcases, 'Queued', OUTPUT_STATUS_COLUMN);
    }
  }

  if (!sheetsToTest.length) {
    Browser.msgBox('No any test case sheet found.', Browser.Buttons.OK);
    return;
  }

  openAlertDialog(`${sheetsToTest.length} test sheet${sheetsToTest.length > 1 ? 's' : ''} ${sheetsToTest.length == 1 ? 'has' : 'have'} been queued`);

  try {
    apis.startAllTest(sheetsToTest);

  } catch (err) {
    appLog(err);
    Browser.msgBox(JSON.stringify(err.message), Browser.Buttons.OK);
  }
}

function startGivenSheetTest() {
  const testCaseSheet = SpreadsheetApp.getActiveSheet();
  const testCaseJson = testCasesToJson(testCaseSheet);
  let sheetsToTest = [];

  const { testcases } = testCaseJson;

  testcases.forEach((testCase) => {
    const { parameter } = testCase;
    const activeSheet = SpreadsheetApp.getActive().getSheetByName(parameter);

    if (activeSheet) {
      const formatSheetToJsonData = testCasesToJson(activeSheet);
      sheetsToTest.push(formatSheetToJsonData);
      updateTestStatus(activeSheet, formatSheetToJsonData.testcases, 'Queued', OUTPUT_STATUS_COLUMN);
    }
  });

  if (!sheetsToTest.length) {
    Browser.msgBox('No any test case sheet found.', Browser.Buttons.OK);
    return;
  }

  openAlertDialog(`${sheetsToTest.length} test sheet${sheetsToTest.length > 1 ? 's' : ''} ${sheetsToTest.length == 1 ? 'has' : 'have'} been queued`);

  try {
    apis.startAllTest(sheetsToTest);

  } catch (err) {
    appLog(err);
    Browser.msgBox(JSON.stringify(err.message), Browser.Buttons.OK);
  }
}

function updateTestStatus(sheet, testCases, status, columnName) {
  let dataValues = sheet.getDataRange().getValues();  // Gets range from start to end cells that contain data

  testCases.forEach((testCase) => {
    setValueToSheet({ sheet, columnName, row: testCase.rowNumber, status, dataValues });
  });
}

function refreshTestStatus(testCasesSheet) {
  // Refresh the status result

  let data;
  if (MOCK_API) {
    data = mockRefresh();

    data.results.forEach((result, i) => {
      setValueToSheet({
        sheet: testCasesSheet,
        columnName: OUTPUT_STATUS_COLUMN,
        row: result.testCase.rowNumber,
        status: result.status
      });
    });

    return;
  }

  const { sheetId, pageId } = getSheetInfo(testCasesSheet);

  try {
    data = apis.getStatusApi({ sheetId, pageId });
    let dataValues = testCasesSheet.getDataRange().getValues();

    data.results.forEach((result, i) => {
      result = JSON.parse(result);
      setValueToSheet({
        sheet: testCasesSheet,
        columnName: OUTPUT_STATUS_COLUMN,
        row: result.testCase.rowNumber,
        status: result.status,
        dataValues
      });

      setValueToSheet({
        sheet: testCasesSheet,
        columnName: OUTPUT_SCREENSHOT_COLUMN,
        row: result.testCase.rowNumber,
        status: result.screenshot,
        dataValues
      });
    });
  } catch (err) {
    appLog(err);
    Browser.msgBox(JSON.stringify(err), Browser.Buttons.OK);
  }
}

function refreshCurrentTest() {
  let testCasesSheet = SpreadsheetApp.getActiveSheet();
  refreshTestStatus(testCasesSheet);

  openAlertDialog(`Current test has been refreshed`);
}

function refreshAllTests() {
  const confirm = Browser.msgBox("Are you sure you want to get all test results?", Browser.Buttons.OK_CANCEL);

  if (confirm != 'ok') {
    return;
  };

  const allSheets = SpreadsheetApp.getActive().getSheets();
  const sheetsInfo = getAllSheetInfo(allSheets);

  if (!sheetsInfo.length) {
    Browser.msgBox('No any test case sheet found.', Browser.Buttons.OK);
    return;
  }

  try {
    data = apis.getAllTestStatus(sheetsInfo);

    data.forEach((testCase) => {
      const { test, results } = testCase;
      const { sheet: { pageId } } = JSON.parse(test.originalRequest);
      const testCasesSheet = allSheets.find((sheet) => sheet.getSheetId().toString() === pageId);

      if (testCasesSheet) {
        let dataValues = testCasesSheet.getDataRange().getValues();

        results.forEach((result) => {
          result = JSON.parse(result);
          setValueToSheet({
            sheet: testCasesSheet,
            columnName: OUTPUT_STATUS_COLUMN,
            row: result.testCase.rowNumber,
            status: result.status,
            dataValues
          });

          setValueToSheet({
            sheet: testCasesSheet,
            columnName: OUTPUT_SCREENSHOT_COLUMN,
            row: result.testCase.rowNumber,
            status: result.screenshot,
            dataValues
          });
        });
      }
    });

    openAlertDialog(`All test has been refreshed.`);
  } catch (err) {
    appLog(err);
    Browser.msgBox(JSON.stringify(err.message), Browser.Buttons.OK);
  }
}

function getAllSheetInfo(allSheets) {
  let sheetsInfo = [];

  for (let sheet in allSheets) {
    const activeSheet = allSheets[sheet];

    if (activeSheet.getName().startsWith("TC-")) {
      const { sheetId, pageId } = getSheetInfo(activeSheet);
      sheetsInfo.push({ sheetId, pageId });
    }
  }

  return sheetsInfo;
}

function fetchLogs() {
  clearLogsSheet();
  const { sheetId } = getSpreadsheetInfo();
  try {
    const logs = apis.getLogs(sheetId);

    for (let log of logs) {
      appLog(log);
    }
  } catch (err) {
    appLog(err);
    Browser.msgBox(JSON.stringify(err), Browser.Buttons.OK);
  }
}

function generateJSON() {
  const testCasesSheet = SpreadsheetApp.getActiveSheet();
  const testCaseObj = testCasesToJson(testCasesSheet);
  // const obj = { 'reuseables': testCaseObj.reusables};
  var json = JSON.stringify(testCaseObj, null, 2);
  appLog(json);
}

function clearDb() {
  let testCasesSheet = SpreadsheetApp.getActiveSheet();
  try {
    apis.clearRedisDb(testCasesSheet);
    Browser.msgBox('Db is cleared successfully.', Browser.Buttons.OK);

  } catch (err) {
    appLog(err);
    Browser.msgBox(JSON.stringify(err), Browser.Buttons.OK);
  }
}
