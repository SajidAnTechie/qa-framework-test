// Utility functions

function getSpreadsheetInfo() {
  spreadsheet = SpreadsheetApp.getActive();
  return {
    sheetId: spreadsheet.getId().toString(),
    sheetName: spreadsheet.getName(),
  }
}

function getSheetInfo(sheet) {
  const pageId = sheet.getSheetId().toString();
  const pageName = sheet.getSheetName();
  const { sheetId, sheetName } = getSpreadsheetInfo();

  return {
    "sheetId": sheetId,
    "sheetName": sheetName,
    "pageId": pageId,
    "pageName": pageName,
  }
}

function logLargeString(largeString) {
  const length = 4000

  let str = largeString

  while (str.length != 0) {
    let tmp
    if (str.length < length) {
      tmp = str
      str = ""
    }
    else {
      tmp = str.substring(0, length)
      str = str.substring(length, str.length)
    }

    Logger.log(tmp)
  }
}
