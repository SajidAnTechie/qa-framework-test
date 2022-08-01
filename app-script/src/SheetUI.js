function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('QA Automation')
    .addItem('Start Current Test', 'startCurrentTest')
    .addItem('Start All Tests', 'startAllTests')
    .addItem('Start Given sheet test', 'startGivenSheetTest')
    .addSeparator()
    .addItem('Refresh Current', 'refreshCurrentTest')
    .addItem('Refresh All', 'refreshAllTests')
    .addSeparator()
    .addItem('[Dev] Clear All Log', 'clearLogsSheet')
    .addItem('[Dev] Get Logs', 'fetchLogs')
    .addItem('[Dev] Generate JSON', 'generateJSON')
    .addItem('[Dev] Clear DB for this sheet', 'clearDb')
    .addSeparator()
    // .addSubMenu(ui.createMenu('')
    //     .addItem('Second item', 'menuItem2'))
    .addToUi();
}

function openAlertDialog(alertText) {
  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
    .alert(alertText);
}
