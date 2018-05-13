var inventorySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Inventory");
var weightCollection = inventorySheet.getRange('A1:B8')

function tableJSON(arr) {
  var i, j, obj = {};
  for (j = 1; j < arr[0].length; j++) {
    obj[arr[0][j]] = {};
  }
  for (i = 1; i < arr.length; i++) {
    for (j = 1; j < arr[0].length; j++) {
      obj[arr[0][j]][arr[i][0]] = arr[i][j];
    }
  }
  return JSON.parse(obj);
}

Logger.log(tableJSON(weightCollection))

var platingSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
var goalWeight = platingSheet.getCurrentCell();
