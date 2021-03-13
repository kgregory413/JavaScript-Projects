/*
  Assignment: Blood Pressure Tracker
  Author: Kylie Gregory
  Date: 8/18/2020
  Purpose: To provide the functionality of creating a graph of my data overtime
    based on the data in local storage.
*/

/*
  showGraph will try to get the tbRecords from localStorage.  If there are
  no records, then it will alert the user and return to the menu page.
  Otherwise, it will set-up the canvas and draw a line graph showing the 
  PressureRange values over time in the records and lines for the lower and upper
  bound of the target PressureRange range
*/
function showGraph() {
  try {
    var tbRecords = JSON.parse(localStorage.getItem("tbRecords"));

    if (tbRecords == null) {
      alert("No records exist yet");

      $(location).attr("href", "#pageMenu");
    } else {
      setupCanvas();

      var bpArr = new Array();
      var dateArr = new Array();
      getBPHistory(bpArr, dateArr);

      var bpLower = new Array(2);
      var bpUpper = new Array(2);
      getBPBounds(bpLower, bpUpper);

      drawLines(bpArr, dateArr, bpLower, bpUpper);
      labelAxes();
    }
  } catch(e) {
    if (window.navigator.vendor === "Google Inc.") {
      if(e === DOMException.QUOTA_EXCEEDED_ERR) {
        alert("Error: Saving to local storage.");
      }
    } else if (e === QUOTA_EXCEEDED_ERR) {
      alert("Error: Saving to local storage.");
    }

    console.log(e);
  }
}

/*
  setupCanvas will get the GraphCanvas element and will add a rectangle for
  the background to the context of the canvas
*/
function setupCanvas() {
  var canvas = document.getElementById("GraphCanvas");
  var context = canvas.getContext("2d");

  context.fillStyle = "#FFFFFF";
  context.fillRect(0, 0, 500, 500);
}

/*
  getBPHistory will take in an empty array for PressureRange values and an empty array 
  for date values and try to fill it with the values from tbRecords in local
  storage.
*/
function getBPHistory(bpArr, dateArr) {
  try {
    var tbRecords = JSON.parse(localStorage.getItem("tbRecords"));

    for (var i = 0; i < tbRecords.length; i++) {
      var currRecord = tbRecords[i];

      var date = new Date(currRecord.Date);
      var month = date.getMonth() + 1;
      var day = date.getDate() + 1;
      dateArr[i] = (month + "/" + day);

      tshArr[i] = parseFloat(currRecord.PressureRange);
    }
  } catch(e) {
    if (window.navigator.vendor === "Google Inc.") {
      if(e === DOMException.QUOTA_EXCEEDED_ERR) {
        alert("Error: Saving to local storage.");
      }
    } else if (e === QUOTA_EXCEEDED_ERR) {
      alert("Error: Saving to local storage.");
    }

    console.log(e);
  }
}

/*
  getBPBounds takes in an empty array for the lower PressureRange bound
  values and an empty array for the upper PressureRange bound values.
  It will try to get the user from local storage to determine and fill in
  these bound arrays.
*/
function getBPBounds(bpLower, bpUpper) {
  try {
    var user = JSON.parse(localStorage.getItem("user"));
    var BPLevel = user.PressureRange;

    if (BPLevel == "Elevated") {
      bpUpper[0] = 80;
      bpUpper[1] = 80;
      bpLower[0] = 85;
      bpLower[1] = 85;
    } else if (BPLevel == "StageOneHigh") {
      bpUpper[0] = 85;
      bpUpper[1] = 85;
      bpLower[0] = 90;
      bpLower[1] = 90;
    } else {
      bpUpper[0] = 90;
      bpUpper[1] = 90;
      bpLower[0] = 100;
      bpLower[1] = 100;
    }
  } catch(e) {
    if (window.navigator.vendor === "Google Inc.") {
      if(e === DOMException.QUOTA_EXCEEDED_ERR) {
        alert("Error: Saving to local storage.");
      }
    } else if (e === QUOTA_EXCEEDED_ERR) {
      alert("Error: Saving to local storage.");
    }

    console.log(e);
  }
}

/*
  drawLines will take in an array representing the PressureRange values, an array
  representing the date values, an array representing the upper bound, and
  an array representing the lower bound.  It will use these values to draw
  a line graph and add it to the GraphCanvas element.
*/
function drawLines(bpArr, dateArr, bpUpper, bpLower) {
  var bpLine = new RGraph.Line("GraphCanvas", bpArr, bpUpper, bpLower)
    .Set("labels", dateArr)
    .Set("colors", ["blue", "green", "green"])
    .Set("shadow", true)
    .Set("shadow.offsetx", 1)
    .Set("shadow.offsety", 1)
    .Set("linewidth", 1)
    .Set("numxticks", 6)
    .Set("scale.decimals", 2)
    .Set("xaxispos", "bottom")
    .Set("gutter.left", 40)
    .Set("tickmarks", "filledcircle")
    .Set("ticksize", 5)
    .Set("chart.labels.ingraph", [,["Blood Pressure", "blue", "yellow", 1, 50]])
    .Set("chart.title", "Blood Pressure")
    .Draw();
}

/*
  labelAxes will get the context of the GraphCanvas element and add text
  for the x and y axis labels
*/
function labelAxes() {
  var canvas = document.getElementById("GraphCanvas");
  var context = canvas.getContext("2d");

  context.font = "11px Georgia";
  context.fillStyle = "green";
  context.fillText("Date (MM/DD", 400, 470);
  context.rotate(-Math.PI / 2);
  context.textAlign = "center";
  context.fillText("Blood Pressure Value", -250, 10);
}