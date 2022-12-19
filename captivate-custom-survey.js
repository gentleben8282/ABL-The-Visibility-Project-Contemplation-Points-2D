//what is the URL of your google spreadsheet?
var sheetURL = 'https://script.google.com/macros/s/AKfycbyK9laP9mz-HNp5qwi1wTTszloNiw16UUbbaINmLqjoHll4ow4xok2D97PnNh28iJ70bw/exec';

var questionIdVarName = 'questionId';
var surveyResponseVarName = 'surveyResponse';

var questionId = window.cpAPIInterface.getVariableValue(questionIdVarName);  // get the question ID
var surveyReponse = window.cpAPIInterface.getVariableValue(surveyResponseVarName);  // get the user's survey response
 
//Set up our AJAX 
var xhttp;
if (window.XMLHttpRequest) {
    xhttp = new XMLHttpRequest();
} else {
    xhttp = new ActiveXObject('Microsoft.XMLHTTP');
}
xhttp.open('GET', sheetURL + '?questionId=' + questionId + '&surveyResponse=' + surveyResponse, true);
xhttp.send();
xhttp.onreadystatechange = function () {
    //If we get a successful reply from our spreadsheet:
    if (xhttp.readyState == 4 && xhttp.status == 200) {
        console.log(xhttp.responseText);
    }
}