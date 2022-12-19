// Create a new property service to maintain variables accross instances.
var SCRIPT_PROP = PropertiesService.getScriptProperties(); 

// What to do when a when we recieve an HTTP GET request
function doGet(e) {
    // For this simple app we only need to do one thing.
    return addUser(e.parameter['questionId'], e.parameter['surveyResponse'])
}

// Add our user record and return the list of top ten. 
function addUser(questionId, surveyResponse) {
    //Open the spreadsheet we set up by it's ID
    var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
    //Get the first sheet
    var sheet = doc.getSheets()[0];
    // we want a public lock, one that locks for all invocations
    var lock = LockService.getPublicLock();
    lock.waitLock(30000); // wait 30 seconds before conceding defeat.
    //wrap everything in a try/catch to handle errors
    try {

        // find the question ID's matching column in the spreadsheet
        var numberOfQuestions = 30;
        var range = sheet.getRange(1, 1, 1, numberOfQuestions);
        var questionIds = range.getValues();
        for (columnNumber = 0, columnLength = questionIds[0].length; columnNumber < columnLength; columnNumber++) {
            if (questionIds[0][columnNumber].indexOf(questionId) == 0) {  // if there is a match, add response to the next available column             
                saveToAvailableTargetCell(sheet, sheet.getLastRow(), columnNumber, surveyResponse)
                break;
            }
        }

        //return JSON
        return ContentService.createTextOutput(JSON.stringify({
            "result": "success",
            "questionId": questionId,
            "surveyResponse": surveyResponse
        })).setMimeType(ContentService.MimeType.JSON);
    } catch (e) {//something went wrong. Return an error
         return ContentService.createTextOutput(JSON.stringify({
             "result": "error",
             "error": e.message
        })).setMimeType(ContentService.MimeType.JSON);
    } finally { //release lock
        lock.releaseLock();
    }
}

function saveToAvailableTargetCell(sht, lRow, cNumber, sResponse) {
    var targetCell = sht.getRange(lRow, cNumber + 1);
    var isExistingValue = targetCell.getValue();
    if (!isExistingValue) {
        targetCell.setValue(sResponse);
    } else {
        saveToAvailableTargetCell(sht, lRow + 1, cNumber, sResponse)
    }
}
