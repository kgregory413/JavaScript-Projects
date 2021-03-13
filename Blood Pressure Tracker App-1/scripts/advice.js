/*
  Assignment: Blood Pressure Tracker App
  Author: Kylie Gregory
  Date: 8/18/2020
  Purpose: To provide the functionality for displaying advice based
    on the most recent record in local storage.
*/

/*
  showAdvice will try to get the tbRecords from localStorage.  If there are
  no records, then it will alert the user and return to the menu page.
  Otherwise, it will get the user and most recent record from tbRecords.
  It will get the BP Range from the user and the BP value from the 
  most recent record and use those to draw the advice gauge and display
  the suggested actions.
*/
function showAdvice() {
  try {
    var tbRecords = JSON.parse(localStorage.getItem("tbRecords"));

    if (tbRecords == null) {
      alert("No records exist yet");

      $(location).attr("href", "#pageMenu");
    } else {
      var user = JSON.parse(localStorage.getItem("user"));
      var slcPressureRange = user.PressureRange;

      var mostRecentIndex = tbRecords.length - 1;
      var PressureRange = tbRecords[mostRecentIndex].PressureRange;

      var canvas = document.getElementById("AdviceCanvas");
      var context = canvas.getContext("2d");
      context.fillStyle = "#C0C0C0";
      context.fillRect(0, 0, 550, 550);
      context.font = "22px Arial";
      drawAdviceCanvas(context, PressureRange, Diastolic);
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
  drawAdviceCanvas takes in a 2d context of a canvas, a target blood pressure range,
  and a diastolic value.  It will add text to the context stating the
  diastolic value, the target blood pressure range, the advice based on the
  diastolic value with respect to the target blood pressure level
  and draw the gauge based on the given values.
*/
function drawAdviceCanvas(context, PressureRange, Diastolic) {
  context.font = "22px Arial";
  context.fillStyle = "black";
  context.fillText("Your current Diastolic is " + Diastolic + ".", 25, 320);

  if (PressureRange == "Elevated") {
    context.fillText("Your target BP range is: 120/80mmHg", 25, 350);
    levelAWrite(context, PressureRange);
    levelAMeter(context, PressureRange);
  } else if (TSHLevel == "StageOneHigh") {
    context.fillText("Your target BP range is: 130/80mmHg", 25, 350);
    levelBWrite(context, PressureRange);
    levelBMeter(context, PressureRange);
  } else if (TSHLevel == "StageTwoHigh") {
    context.fillText("Your target BP range is: 140/90mmHg", 25, 350);
    levelCWrite(context, PressureRange);
    levelCMeter(context, PressureRange);
  }
}

/*
  levelAWrite will take in a 2d context of a canvas and a PressureRange value. 
  It will write the advice to the context based on the PressureRange
  value using ranges for levelA.
*/
function levelAWrite(context, PressureRange) {
  if ((PressureRange >= 80) && (PressureRange <= 80)) {
    writeAdvice(context, "green");
  } else if ((PressureRange > 80) && (PressureRange <= 85)) {
    writeAdvice(context, "yellow");
  } else {
    writeAdvice(context, "red");
  }
}

/*
  levelBWrite will take in a 2d context of a canvas and a PressureRange value.
  It will write the advice to the context based on the PressureRange value using
  ranges for level B.
*/
function levelBWrite(context, PressureRange) {
  if ((PressureRange >= 80) && (PressureRange <= 80)) {
    writeAdvice(context, "green");
  } else if ((PressureRange > 80) && (PressureRange <= 90)) {
    writeAdvice(context, "yellow");
  } else if ((PressureRange >= 60) && (PressureRange < 80)) {
    writeAdvice(context, "yellow");
  } else {
    writeAdvice(context, "red");
  }
}

/*
  levelCWrite will take in a 2d context of a canvas and a PressureRange value.
  It will write the advice to the context based on the PressureRange value
  using ranges for level C.
*/
function levelCWrite(context, PressureRange) {
  if ((PressureRange >= 80) && (PressureRange <= 80)) {
    writeAdvice(context, "green");
  } else if ((PressureRange > 80) && (PressureRange <= 90)) {
    writeAdvice(context, "yellow");
  } else if ((PressureRange >= 60) && (PressureRange < 80)) {
    writeAdvice(context, "yellow");
  } else {
    writeAdvice(context, "red");
  }
}

/*
  writeAdvice will take in a 2d context of a canvas and a level color as a
  string that represents the advice rating that is needed.  It will write the
  corresponding advice message to the context.
*/
function writeAdvice(context, level) {
  var adviceLine1 = "";
  var adviceLine2 = "";

  if (level == "red") {
    adviceLine1 = "Please consult with your family";
    adviceLine2 = "physician urgently.";
  } else if (level == "yellow") {
    adviceLine1 = "Contact family physician and recheck blood pressure";
    adviceLine2 = "in 6-8 weeks.";
  } else if (level == "green") {
    adviceLine1 = "Repeat blood pressure work in 3-6 months.";
  }

  context.fillText("Your pressure range is " + PressureRange + ".", 25, 380);
  context.fillText(adviceLine1, 25, 410);
  context.fillText(adviceLine2, 25, 440);
}

/*
  levelAMeter will take in a 2d context of a canvas and a PressureRange value.
  It will check if the PressureRange value is less than or equal to 80. 
  If it is, it will create a corner gauge based with an upper bound of 80.
  Otherwise, it will create a corner gauge with an upper bound of the PressureRange value.
  Finally, it will draw the gauge on the context. Assumes a level A PressureRange value.
*/
function levelAMeter(context, PressureRange) {
  if (PressureRange <= 80) {
    var gauge = new RGraph.CornerGauge("AdviceCanvas", 0, 80, PressureRange)
      .Set("chart.colors.ranges", [[60, 60, "red"], [60, 70, "yellow"],
      [70, 80, "green"]]);
  } else {
    var gauge = new RGraph.CornerGauge("AdviceCanvas", 0, PressureRange, PressureRange)
      .Set("chart.colors.ranges", [[60, 60, "red"], [60, 70, "yellow"],
      [70, 80, "green"], [90, PressureRange, "red"]]);
  }
  drawMeter(gauge);
}

/*
  levelBMeter will take in a 2d context of a canvas and a PressureRange value.
  It will check if the PressureRange value is less than or equal to 80.
  If it is, it will create a corner gauge based with an upper bound of 80.
  Otherwise, it will create a corner gauge with an upper bound of the
  PressureRange value.  Finally, it will draw the gauge on the context.
  Assumes a level B PressureRange value.
*/
function levelBMeter(context, PressureRange) {
  if (PressureRange <= 80) {
    var gauge = new RGraph.CornerGauge("AdviceCanvas", 0, 80, PressureRange)
      .Set("chart.colors.ranges", [[60, 60, "red"], [60, 70, "yellow"],
      [70, 80, "green"], [80, 90, "yellow"]]);
  } else {
    var gauge = new RGraph.CornerGauge("AdviceCanvas", 0, PressureRange, PressureRange)
      .Set("chart.colors.ranges", [[60, 60, "red"], [60, 70, "yellow"],
      [70, 80, "green"], [80, 90, "yellow"], [90, PressureRange, "red"]]);
  }
  drawMeter(gauge);
}

/*
  levelCMeter will take in a 2d context of a canvas and a PressureRange value.  It will
  check if the PressureRange value is less than or equal to 80.  If it is, it will create
  a corner gauge based with an upper bound of 80.  Otherwise, it will create a 
  corner gauge with an upper bound of the PressureRange value.  Finally, it will
  draw the gauge on the context. Assumes a level C PressureRange value.
*/
function levelCMeter(context, PressureRange) {
  if (PressureRange <= 80) {
    var gauge = new RGraph.CornerGauge("AdviceCanvas", 0, 80, PressureRange)
      .Set("chart.colors.ranges", [[60, 60, "red"], [60, 70, "yellow"],
      [70, 80, "green"], [80, 90, "yellow"]]);
  } else {
    var gauge = new RGraph.CornerGauge("AdviceCanvas", 0, PressureRange, PressureRange)
      .Set("chart.colors.ranges", [[60, 60, "red"], [60, 70, "yellow"],
      [70, 80, "green"], [80, 90, "yellow"], [90, PressureRange, "red"]]);
  }
  drawMeter(gauge);
}

/*
  drawMeter will take in a corner gauge object and apply final settings for
  this gauge representing the PressureRange Level and draw it
*/
function drawMeter(gauge) {
  gauge.Set("chart.value.text.units.post", "mmHg")
    .Set("chart.value.text.boxed", false)
    .Set("chart.value.text.size", 14)
    .Set("chart.value.text.font", "Verdana")
    .Set("chart.value.text.bold", true)
    .Set("chart.value.text.decimals", 2)
    .Set("chart.shadow.offsetx", 5)
    .Set("chart.shadow.offsety", 5)
    .Set("chart.scale.decimals", 2)
    .Set("chart.title", "BLOOD PRESSURE RANGE")
    .Set("chart.radius", 250)
    .Set("chart.centerx", 50)
    .Set("chart.centery", 250)
    .Draw();
}