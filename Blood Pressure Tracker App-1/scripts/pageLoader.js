/*
  Assignment: Blood Pressure App
  Author: Kylie Gregory
  Date: 8/16/2020
  Purpose: To provide the functionality pre-loading information when certain
    pages are loaded.
*/

/*
  Add an on pageshow handler for the document so that when a page is made
  active, it will pre-load any necessary information
*/
$(document).on("pageshow", function() {
  if ($(".ui-page-active").attr("id") == "pageUserInfo") {
    showUserForm();
  } else if ($(".ui-page-active").attr("id") == "pageRecords") {
    loadUserInformation();
    listRecords();
  } else if ($(".ui-page-active").attr("id") == "pageAdvice") {
    showAdvice();
    resizeGraph();
  } else if ($(".ui-page-active").attr("id") == "pageGraph") {
    showGraph();
    resizeGraph();
  }
});

/*
  resizeGraph will check if the width of the window is less than 700px.  If it
  is then it will change the width of the advice canvas and graph canvas to be
  50px smaller than the window width
*/
function resizeGraph() {
  if ($(window).width() < 700) {
    $("#AdviceCanvas").css({"width": $(window).width() - 50});
    $("#GraphCanvas").css({"width": $(window).width() - 50});
  }
}