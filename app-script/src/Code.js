function testCasesToJson(testCasesSheet) {
  let reusablesSheet = SpreadsheetApp.getActive().getSheetByName('Reusables')
  let configurationsSheet = SpreadsheetApp.getActive().getSheetByName('Configurations')

  const sheetInfo = getSheetInfo(testCasesSheet)
  const testCases = getRows(testCasesSheet, testCasesFieldsMapping(), true, testCasesBackfillFields())
  const configurations = getRows(configurationsSheet, configurationFieldsMapping())
  const reusables = getRows(reusablesSheet, reusablesFieldsMapping(), true, reuseablesBackfillFields())
  // to make reuseables model consistent with testcase model
  const reuseablesEdited = reusables.map(r => {
    return { ...r, ... { rowNumber: -1, testCaseId: "N/A", step: "N/A", label: "N/A" } };
  });
  const json = {
    sheet: sheetInfo,
    configurations: configurations,
    reusables: reuseablesEdited,
    testcases: testCases
  }

  const jsonString = JSON.stringify(json)

  logLargeString(jsonString)
  return json
}


function getRows(sheet, mapping, backfill = false, backfillFieldsList = []) {
  let lastColumn = sheet.getLastColumn();
  let lastRow = sheet.getLastRow();

  let headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];

  let rows = []
  for (let rowIndex = 2; rowIndex <= lastRow; rowIndex++) {
    let columnStartIndex = 1;
    let numRows = 1;

    let rowRange = sheet.getRange(rowIndex, columnStartIndex, numRows, sheet.getLastColumn())
    let rowValues = rowRange.getValues()[0]

    if (isEmptyRow(rowValues)) continue

    rows.push({
      rowNumber: rowIndex,
      values: rowValues
    })
  }

  if (backfill)
    return prepareDataWithBackfill(headers, rows, mapping, backfillFieldsList);
  else
    return prepareData(headers, rows, mapping)
}

function prepareData(headers, rows, mapping) {
  let data = []
  for (let i = 0; i < rows.length; i++) {
    // Create object
    let object = {}
    for (var j = 0; j < headers.length; j++) {
      let key = headers[j]
      let val = rows[i].values[j]

      object[key] = val
    }

    object["rowNumber"] = rows[i].rowNumber;

    mappedObject = mapFields(object, mapping) // Map the test case fields for json

    if (mappedObject["command"])
      data.push(mappedObject) // Append new test case object
  }

  return data
}

function prepareDataWithBackfill(headers, rows, mapping, backfillFieldsList) {
  let data = []
  let backfillValues = {}

  for (let i = 0; i < rows.length; i++) {
    // Create object
    let object = {}
    for (var j = 0; j < headers.length; j++) {
      let key = headers[j]
      let val = rows[i].values[j]

      if (backfillFieldsList.includes(key)) {  // Backfill
        if (val) {
          backfillValues[key] = val
        }
        else {
          val = backfillValues[key]
        }
      }

      object[key] = val
    }

    object["rowNumber"] = rows[i].rowNumber;

    mappedObject = mapFields(object, mapping) // Map the test case fields for json

    if (mappedObject["command"])
      data.push(mappedObject) // Append new test case object
  }

  return data
}

function isEmptyRow(row) {
  for (let i = row.length - 1; i >= 0; i--) {
    if (row[i]) return false
  }

  return true
}
