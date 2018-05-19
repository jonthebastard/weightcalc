function addDaysToDate(date,d){
  var result = new Date(date.getTime()+d*(24*3600*1000));
  return Utilities.formatDate(result, "GMT-7", "MM/dd/yyyy");
}

function subDaysFromDate(date,d){
  var result = new Date(date.getTime()-d*(24*3600*1000));
  return Utilities.formatDate(result, "GMT-7", "MM/dd/yyyy");
}

function rowCounter(rowletter) {
  var column = sourceSheet.getRange(rowletter+':'+rowletter);
  var values = column.getValues();
  var ct = 7;
  while ( values[ct][0] != "" ) {
    ct++;
  }
  return ct++;
}

var programWorksheets = SpreadsheetApp.getActiveSpreadsheet();
var sourceSheet = programWorksheets.getSheetByName("INPUTS");
var destSheet = programWorksheets.getSheetByName("1RMTracking");

var sheetNameArray = [];
for (var i = 0 ; i < programWorksheets.getSheets().length; i += 1) {
  var key = programWorksheets.getSheets()[i].getName();
  if (key.match(/^\d$/)) {
    sheetNameArray.push(key);
  }
}

var cycleDate = new Date(sourceSheet.getRange('F1').getValue());
var today = new Date();
var formatToday = Utilities.formatDate(today, "GMT-7", "MM/dd/yyyy");

function clearForNewWeek(e) {
  if ((addDaysToDate(cycleDate,28) == formatToday) && (rowCounter("B") == rowCounter("F"))) {

    var Squat1RM = destSheet.getRange('D34').getMergedRanges()[0].getCell(1, 1).getValue();
    var Bench1RM = destSheet.getRange('G34').getMergedRanges()[0].getCell(1, 1).getValue();
    var Dead1RM = destSheet.getRange('J34').getMergedRanges()[0].getCell(1, 1).getValue();

    if ( Squat1RM=="" || Bench1RM=="" || Dead1RM=="" ) {
      throw new Error( "One or more 1RMs are blank!" );
    }
    else {
      sourceSheet.getRange('B' + (rowCounter("B")+1)).setValue(Squat1RM);
      sourceSheet.getRange('C' + (rowCounter("C")+1)).setValue(Bench1RM);
      sourceSheet.getRange('D' + (rowCounter("D")+1)).setValue(Dead1RM);
    }

    var oneRepMaxCounts = [ "T45", "T47", "T49", "T51", "T53", "T55" ]
    var plateLists = [ "H4:O30", "H33:O55" ]
    for (var i = 0; i < sheetNameArray.length; i += 1) { 
      var weekSheet = programWorksheets.getSheetByName(i+1);
      for (var j = 0; j < oneRepMaxCounts.length; j += 1) {
        weekSheet.getRange(oneRepMaxCounts[j]).getMergedRanges()[0].getCell(1, 1).clearContent();
      }
      for (var k = 0; k < plateLists.length; k += 1) {
        weekSheet.getRange(plateLists[k]).clearContent();      
      }
    }
    sourceSheet.getRange('F1').setValue(formatToday);
  }
}
