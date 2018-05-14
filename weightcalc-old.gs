// get values for each set, selecting only non-blank cells
var workSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Plating");
var liftingSets = workSheet.getRange('C2:C').getValues().reduce(function(acc, row) {
  return acc.concat(row.filter(function(x) {
    return x != "";
  }));
}, []);

// get full inventory of available plates
var plateInventory = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Inventory").getDataRange().getValues();

function weightCalc(setWeight)
{
  // build remainingPlates as a list from plateInventory: weight x count
  var remainingPlates = [];
  for (var i = 1 ; i < plateInventory.length; i++) {
    for (var j = 0 ; j < plateInventory[i][1]; j++) {
      remainingPlates.push(plateInventory[i][0]);
    }
  }
  // calculate weight total per side: (total - bar) / 2
  var goalSide = parseFloat((setWeight - 45) / 2);
  var totalSide = parseFloat(0);
  
  // build totalSide up to goalSide via adding (plate)s to sidePlates
  // subtract from remainingPlates with each (plate) used
  // sidePlates = list of (plate)s to use, in order
  var sidePlates = [];
  while ( totalSide <= goalSide, remainingPlates.length > 0 ) {
    var plate = parseFloat(remainingPlates[0]);
    if ( totalSide + plate <= goalSide ) {
      parseFloat(totalSide += plate) ;
      sidePlates.push(plate);
    }
    remainingPlates.shift();
  }
  
  // return the per-side total and the list of plates
  var sideWeight = [totalSide, sidePlates]
  return sideWeight;
}

function weightPrint() {
  for (var i = 1 ; i < liftingSets.length; i++) {

    var setSide = liftingSets[i];

    // if no value is given for the weight total, skip it
    if ( setSide == workSheet.getRange((i+2),3).getValue()) {
      
      // build out the per-side total and the stack of plates
      workSheet.getRange((i+2),4).setValue(weightCalc(liftingSets[i])[0]);
      var setStack = weightCalc(liftingSets[i])[1];
      for (var j = 0 ; j < setStack.length; j++) {
        workSheet.getRange((i+2),(j+5)).setValue(setStack[j]);
      }
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
