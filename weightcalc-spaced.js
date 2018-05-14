// get values for each set, selecting only non-blank cells
var workSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Plating");
var liftingSets = workSheet.getRange('F4:F').getValues().reduce(function(acc, row) {
  return acc.concat(row.filter(function(x) {
    return x != "";
  }));
}, []);

// get full inventory of available plates
var plateInventory = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Inventory").getDataRange().getValues();

function weightCalc(setWeight)
{
  // calculate weight total per side: (total - bar) / 2
  var goalSide = parseFloat((setWeight - 45) / 2);
  var totalSide = parseFloat(0);
  var sidePlates = [];
  
  // build remainingPlates as a list from plateInventory: weight x count
  var remainingPlates = [];
  for (var i = 1 ; i < plateInventory.length; i++) {
    for (var j = 0 ; j < plateInventory[i][1]; j++) {
      remainingPlates.push(plateInventory[i][0]);
    }
  }

  // build totalSide up to goalSide via adding (plate)s to sidePlates
  while ( totalSide <= goalSide, remainingPlates.length > 0 ) {
    var plate = parseFloat(remainingPlates[0]);
    if ( totalSide + plate <= goalSide ) {
      parseFloat(totalSide += plate) ;
      sidePlates.push(plate);
    }
    remainingPlates.shift();
  }
  
  return sidePlates;
}

function weightPrint() {
  for (var i = 0 ; liftingSets.length > 0 ; i+=2 ) {
    
    // verify that the stored set total matches the number listed
    var setSide = liftingSets[0];
    if ( setSide == workSheet.getRange((i+5),6).getMergedRanges()[0].getCell(1, 1).getValue()) {
      var setStack = weightCalc(setSide);
      for (var j = 0 ; j < setStack.length; j++) {
        var cell = workSheet.getRange((i+5),(j+8));
        cell.getMergedRanges()[0].getCell(1, 1).setValue(setStack[j]);
      }
      liftingSets.shift();
    }
  }
}

// menu function to run weightCalc via weightPrint
function onOpen() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var menuEntries = [];
  menuEntries.push({name: "Calculate Plates Per Side", functionName: "weightPrint"}); 
  sheet.addMenu("Plate Calculator", menuEntries);
}
