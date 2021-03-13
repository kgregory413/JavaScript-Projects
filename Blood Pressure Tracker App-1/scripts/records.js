/*
  Assignment: Blood Pressure App
  Author: Kylie Gregory
  Date: 8/16/2020
  Purpose: To provide the functionality for loading information on the records
    page, adding new records, editing records, and deleting/clearing records.
*/

/*
  loadUserInformation is going to try to get user from localStorage and load
  a summary of the information into the divUserSection element
*/
function loadUserInformation() {
  try {
    var user = JSON.parse(localStorage.getItem("user"));
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

  if (user != null) {
    $("#divUserSection").empty();

    var age = calcUserAge(user.DOB);
    var Systolic = determineSystolic(user.Systolic);
    var Diastolic = determineDiastolic(user.Diastolic);
    var PressureRange = determinePressureRange(user.PressureRange);

    $("#divUserSection").append("<p>User's Name: " + user.FirstName + " " + 
      user.LastName + "<br>Age: " + age + "<br>Health Card Number: " +
      user.HealthCardNumber + "<br>New Password: " + user.NewPassword + 
      "<br>Pressure Range: " + PressureRange + "<br>Systolic BP: " + 
      Systolic + "<br>Diastolic BP: " + Diastolic + "</p>");
    $("#divUserSection").append("<a href='#pageUserInfo' data-mini='true' " +
      "id='btnProfile' data-role='button' data-icon='edit' data-iconpos=" +
      "'left' data-inline='true'>Edit Profile</a>");
    $("#btnProfile").button();
  }
}

/*
  calcUserAge takes in a date of birth and returns the age based on the
  current date
*/
function calcUserAge(dateOfBirth) {
  var today = new Date();
  var dob = new Date(dateOfBirth);
  var age = Math.floor((today - dob) / (365.25 * 24 * 60 * 60 * 1000));
  return age;
}

/*
  determinePressureRange will take in a string representing the user's
  pressure range that doesn't have any spaces and return a more user
  friendly string representation of the range.
*/
function determinePressureRange(pressureRange) {
  if (pressureRange == "Normal") {
    return "Normal";
  } else if (pressureRange == "Elevated") {
    return "Elevated";
  } else if (pressureRange == "StageOneHigh") {
    return "Stage 1 HBP";
  } else {
    return "Stage 2 HBP";
  }
}

/*
  determineSystolic will take in a string representing the user's
  systolic pressure range that doesn't have any spaces and return a more user
  friendly string representation of the systolic range.
*/
function determineSystolic(systolic) {
  if (systolic == "BelowSBP") {
    return "Stage 120";
  } else if (systolic == "LowBetweenSBP") {
    return "Between 120-129";
  } else if (systolic == "HighBetweenSBP") {
    return "Between 130-139";
  } else {
    return "Above 140";
  }
}

/*
  determineDiastolic will take in a string representing the diastolic pressure
  range that doesn't have any spaces and return a more user friendly
  string representation of the pressure range
*/
function determineDiastolic(diastolic) {
  if (diastolic == "BelowDBP") {
    return "Below 80";
  } else if (diastolic == "BetweenFBP") {
    return "Between 80-89";
  } else {
    return "Above 90";
  }
}

/*
  Add a click handler function to the btnAddRecord element that will update the
  value of the btnSubmitRecord element to be "Add" and then refresh
*/
$("#btnAddRecord").click( function() {
  $("#btnSubmitRecord").val("Add");
  if ($("#btnSubmitRecord").hasClass("btn-ui-hidden")) {
    $("#btnSubmitRecord").button("refresh");
  }
});

/*
  Add an on pageshow handler function to the pageNewRecordForm element.  If we
  are adding a new record, then we will clear the form.  If we are editing a
  record, then it will pre-load the form with the saved information of the 
  record we are editing.
*/
$("#pageNewRecordForm").on("pageshow", function() {
  var formOperation = $("#btnSubmitRecord").val();

  if (formOperation == "Add") {
    clearRecordForm();
  } else if (formOperation == "Edit") {
    showRecordForm($("#btnSubmitRecord").attr("indexToEdit"));
  }
});

/*
  clearRecordForm will set the value of each input element on the 
  pageNewRecordForm element to be ""
*/
function clearRecordForm() {
  $("#datExamDate").val("");
  $("#txtSystolic").val("");
  $("#txtDiastolic").val("");
  $("#txtDiuretic").val("");
}

/*
  checkRecordForm will check each user input element of the form on the 
  Add New Record page.  If an element has an invalid value, it will alert the
  user and return false.  Otherwise, if they are all valid, it will return true
*/
function checkRecordForm() {
  if ($("#datExamDate").val() > getCurrentDateFormatted()) {
    alert("The exam date can't be in the future");
    return false;
  } else if ($("#txtSystolic").val() == "") {
    alert("You need to enter a pressure value.");
    return false;
  } else if (parseFloat($("#txtSystolic").val()) < 0) {
    alert("You can't have a negative systolic pressure.");
    return false;
  } else if ($("#txtDiastolic").val() != "" && parseFloat($("#txtDiastolic").val()) < 0) {
    alert("You can't have a negative diastolic pressure.");
    return false;
  } else if (parseFloat($("#txtDiuretic").val()) < 0 || 
      parseFloat($("#txtDiuretic").val()) > 1000000) {
    alert("Diuretic value must be between 0 and 1000000");
  } else {
    return true;
  }
}

/*
  getCurrentDateFormatted will return the current date in the format
  "yyyy-mm-dd"
*/
function getCurrentDateFormatted() {
  var date = new Date();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var year = date.getFullYear();

  var formattedDate = year + "-" + 
    (("" + month).length < 2 ? "0" : "") + month + "-" +
    (("" + day).length < 2 ? "0" : "") + day;

  return formattedDate;
}

/*
  Add a submit form handler to the frmNewRecordForm element.  If the value of
  the btnSubmitRecord element is "Add", then we will add the record and 
  change the page to pageRecords.  If the value is "Edit", then we will save
  the updated information for that record to tbRecords, change the page to
  pageRecords, and remove the attribute for indexToEdit.
*/
$("#frmNewRecordForm").submit(function() {
  var formOperation = $("#btnSubmitRecord").val();

  if (formOperation == "Add") {
    if (addRecord()) {
      $.mobile.changePage("#pageRecords");
    }
  } else if (formOperation == "Edit") {
    if (editRecord($("#btnSubmitRecord").attr("indexToEdit"))) {
      $.mobile.changePage("#pageRecords");
      $("#btnSubmitRecord").removeAttr("indexToEdit");
    }
  }

  return false;
});

/*
  addRecord will check if the record form is completed properly.  If it is,
  then it will try to save the values of the input elements in the form
  to localStorage by adding them to the tbRecords key.  If it successfully
  adds the record and saves it to localStorage it returns true.  Otherwise,
  it will return false;
*/
function addRecord() {
  if (checkRecordForm()) {
    var record = {
      "Date" : $("#datExamDate").val(),
      "Systolic" : $("#txtSystolic").val(),
      "Diastolic" : $("#txtDiastolic").val(),
      "Diuretic" : $("#txtDiuretic").val()
    }

    try {
      var tbRecords = JSON.parse(localStorage.getItem("tbRecords"));

      if(tbRecords == null) {
        tbRecords = [];
      }

      tbRecords.push(record);
      tbRecords.sort(compareDates);
      localStorage.setItem("tbRecords", JSON.stringify(tbRecords));
      alert("Saving Information");
      clearRecordForm();
      listRecords();

      return true;
    } catch(e) {
      if (window.navigator.vendor === "Google Inc.") {
        if(e === DOMException.QUOTA_EXCEEDED_ERR) {
          alert("Error: Saving to local storage.");
        }
      } else if (e === QUOTA_EXCEEDED_ERR) {
        alert("Error: Saving to local storage.");
      }
  
      console.log(e);
      
      return false;
    }
  } else {
    return false;
  }
}

/*
  listRecords will try to get tbRecords from localStorage.  If it exists, then
  it will fill in a sorted table of all the records in tbRecords.  It will be
  the tblRecords element that gets updated.
*/
function listRecords() {
  try {
    var tbRecords = JSON.parse(localStorage.getItem("tbRecords"));
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

  if (tbRecords != null) {
    tbRecords.sort(compareDates);

    // initialize the table
    $("#tblRecords").html(
      "<thead>" +
      "  <tr>" +
      "    <th>Date</th>" +
      "    <th><abbr title='Diastolic Blood Pressure'>Diastolic BP</abbr>" +
      "</th>" +
      "    <th><abbr title='Systolic Blood Pressure'>Systolic BP</abbr>" +
      "</th>" +
      "    <th><abbr title='Diuretic Dosage'>Diuretic (mg)</abbr>" +
      "</th>" +
      "    <th>Edit / Delete</th>" +
      "  </tr>" +
      "</thead>" + 
      "<tbody>" +
      "</tbody>"
    );

    // insert each record into the table
    for (var i = 0; i < tbRecords.length; i++) {
      var rec = tbRecords[i];
      $("#tblRecords tbody").append(
        "<tr>" +
        "  <td>" + rec.Date + "</td>" + 
        "  <td>" + rec.Systolic + "</td>" + 
        "  <td>" + rec.Diastolic + "</td>" + 
        "  <td>" + rec.Diuretic + "</td>" + 
        "  <td><a data-inline='true' data-mini='true' data-role='button'" +
        "href='#pageNewRecordForm' onclick='callEdit(" + i + ");' " +
        "data-icon='edit' data-iconpos='notext'></a>" +
        "    <a data-inline='true' data-mini='true' data-role='button' " +
        "href='#' onclick='callDelete(" + i + ");' data-icon='delete' " +
        "data-iconpos='notext'></a></td>" +
        "</tr>"
      );
    }

    $("#tblRecords [data-role='button']").button();
  } else {
    $("#tblRecords").html("");
  }
}

/*
  compareDates will take in two date values.  If the first date value is 
  greater than the second it will return 1.  Otherwise, it returns -1.
*/
function compareDates(date1, date2) {
  var d1 = new Date(date1.Date);
  var d2 = new Date(date2.Date);

  if (d1 > d2) {
    return 1;
  } else {
    return -1;
  }
}

/*
  Add a click event handler to the btnClearHistory element.  This will remove
  tbRecords from localStorage, call listRecords again, and alert the user
  to them them know the records have all been deleted.
*/
$("#btnClearHistory").click(function() {
  try {
    localStorage.removeItem("tbRecords");
    listRecords();
    alert("All records have been deleted.");
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
});

/*
  callDelete takes in an index representing the index of the record to remove
  from tbRecords in the localStorage.  It will delete that record from local
  storage and call listRecords to display the updated tbRecords.
*/
function callDelete(index) {
  deleteRecord(index);
  listRecords();
}

/*
  deleteRecord takes in an index of the record to remove from tbRecords in the
  localStorage.  It will remove this record and update the value of tbRecords
  in localStorage.  If tbRecords no longer has any records, it will be removed
  from localStorage.
*/
function deleteRecord(index) {
  try {
    var tbRecords = JSON.parse(localStorage.getItem("tbRecords"));

    tbRecords.splice(index, 1);

    if(tbRecords.length == 0) {
      localStorage.removeItem("tbRecords");
    } else {
      localStorage.setItem("tbRecords", JSON.stringify(tbRecords));
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
  callEdit takes in an index of a record in tbRecords to update.  It will set 
  the attribute indexToEdit on the btnSumbitRecord element to the given index.
  It will also set the value to Edit and refresh the button.
*/
function callEdit(index) {
  $("#btnSubmitRecord").attr("indexToEdit", index);
  $("#btnSubmitRecord").val("Edit");
  if ($("#btnSubmitRecord").hasClass("btn-ui-hidden")) {
    $("#btnSubmitRecord").button("refresh");
  }
}

/*
  showRecordForm takes in an index of a record to edit.  It gets the record at
  that index from tbRecords in localStorage and sets the values of the
  corresponding input elements in the form to those values.
*/
function showRecordForm(index) {
  try {
    var tbRecords = JSON.parse(localStorage.getItem("tbRecords"));
    var rec = tbRecords[index];

    $("#datExamDate").val(rec.Date);
    $("#txtSystolic").val(rec.Systolic);
    $("#txtDiastolic").val(rec.Diastolic);
    $("#txtDiuretic").val(rec.Diuretic);
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
  editRecord will take in an index of a record to edit in tbRecords.  It will
  try to get tbRecords from localStorage and update the value at the given
  index based on the values from the input elements in the frmNewRecordForm, 
  if all of the values are valid. If it is successful, it will return true.
  Otherwise, it returns false.
*/
function editRecord(index) {
  if (checkRecordForm()) {
    try {
      var tbRecords = JSON.parse(localStorage.getItem("tbRecords"));
      tbRecords[index] = {
        "Date" : $("#datExamDate").val(),
        "Systolic" : $("#txtSystolic").val(),
        "Diastolic" : $("#txtDyastolic").val(),
        "Diuretic" : $("#txtDiuretic").val()
      }
      
      tbRecords.sort(compareDates);
      localStorage.setItem("tbRecords", JSON.stringify(tbRecords));
      alert("Saving Information");
      clearRecordForm();
      listRecords();

      return true;
    } catch(e) {
      if (window.navigator.vendor === "Google Inc.") {
        if(e === DOMException.QUOTA_EXCEEDED_ERR) {
          alert("Error: Saving to local storage.");
        }
      } else if (e === QUOTA_EXCEEDED_ERR) {
        alert("Error: Saving to local storage.");
      }
  
      console.log(e);
      
      return false;
    }
  } else {
    return false;
  }
}