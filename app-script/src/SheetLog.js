const LOG_SHEET_NAME = "Logs";

// copied from https://stackoverflow.com/questions/6882104/faster-way-to-find-the-first-empty-row-in-a-google-sheet-column
// Don's array approach - checks first column only
// With added stopping condition & correct result.
// From answer https://stackoverflow.com/a/9102463/1677912
function getFirstEmptyRowByColumnArray(spr) {
  var column = spr.getRange('A:A');
  var values = column.getValues(); // get all data in one call
  var ct = 0;
  while (values[ct] && values[ct][0] != "") {
    ct++;
  }
  return (ct + 1);
}

function clearLogsSheet() {
  const logsSheet = SpreadsheetApp.getActive().getSheetByName(LOG_SHEET_NAME);
  const range = logsSheet.getRange('A:A');
  range.clear();
}

function appLog(log) {
  Logger.log("App script log:" + log);
  const logsSheet = SpreadsheetApp.getActive().getSheetByName(LOG_SHEET_NAME);
  const firstEmptyRow = getFirstEmptyRowByColumnArray(logsSheet);
  const range = logsSheet.getRange('A:A');
  range.getCell(firstEmptyRow, 1).setValue(log);
}