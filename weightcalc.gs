function weightToJSON()
{
  var inventorySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Inventory");
  var data = inventorySheet.getRange('A1:B8').getValues();
  var obj = {};
  var result = [];
  var headers = data[0];
  var cols = headers.length;
  var row = [];

  for (var i = 1, l = data.length; i < l; i++)
  {
    // get a row to fill the object
    row = data[i];
    // clear object
    obj = {};
    for (var col = 0; col < cols; col++) 
    {
      // fill object with new values
      obj[headers[col]] = row[col];    
    }
    // add object in a final result
    result.push(obj);  
  }
  return result;  
}

function weightCalc(goal)
{
  var perSide = (goal - 45) / 2;
  var totalSide = 0;
  
  var weightCollection = []
  for (var i = 1, l = data.length; i < l; i++)

  
  
}
