/*
  Assignment: Blood Pressure App
  Author: Kylie Gregory
  Date: 8/16/2020
  Purpose: To provide the functionality for the user profile page to validate
    the data, save the information to local storage, and show the information
    that is currently saved.
*/

/*
  checkUserForm and it will ensure that each required input element of the form
  has a valid value.
*/
function checkUserForm() {
  if ($("#txtFirstName").val() == "") {
    alert("You need to enter your first name.");
    return false;
  } else if ($("#txtLastName").val() == "") {
    alert("You need to enter your last name.");
    return false;
  } else if ($("#datBirthdate").val() == "") {
    alert("You need to enter your birthdate");
    return false;
  } else if ($("#datBirthdate").val() > getCurrentDateFormatted()){
    alert("Your birthdate can't be in the future");
    return false;
  } else if ($("#txtHealthCardNumber").val() == "") {
    alert("You need to enter your Health Card Number.");
    return false;
  } else if($("#slcPressureRange option:selected").val() == "") {
    alert("You need to select a blood pressure range.");
    return false;
  } else if($("#slcSystolic option:selected").val() == "") {
    alert("You need to select a systolic pressure range.");
    return false;
  } else if($("#slcDiastolic option:selected").val() == "") {
    alert("You need to select a diastolic pressure range.");
    return false;
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
  Add a submit handler for the frmUserForm element that will call saveUserForm
  and return false to prevent default behavior of submitting the form
*/
$("#frmUserForm").submit( function() {
  saveUserForm();
  return false;
})

/*
  saveUserForm will check that the required inputs are all valid.  If they are,
  then it will attempt to save the information in the form to localStorage
  saved with the key user
*/
function saveUserForm() {
  if (checkUserForm()) {
    var user = {
      "FirstName" : $("#txtFirstName").val(),
      "LastName" : $("#txtLastName").val(),
      "DOB" : $("#datBirthdate").val(),
      "NewPassword" : $("#changePassword").val(),
      "HealthCardNumber" : $("#txtHealthCardNumber").val(),
      "PressureRange" : $("#slcPressureRange option:selected").val(),
      "Systolic" : $("#slcSystolic option:selected").val(),
      "Diastolic" : $("#slcDiastolic option:selected").val()
    };

    try {
      localStorage.setItem("user", JSON.stringify(user));
      alert("Saving Information");

      $.mobile.changePage("#pageMenu");
      window.location.reload();
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
}

/*
  showUserForm this will try to get the user from local storage.  If it exists,
  then it will load the information into the user form based on the associated
  values.
*/
function showUserForm() {
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
    $("#txtFirstName").val(user.FirstName);
    $("#txtLastName").val(user.LastName);
    $("#datBirthdate").val(user.DOB);
    $("#changePassword").val(user.NewPassword);
    $("#txtHealthCardNumber").val(user.HealthCardNumber);
    $("#slcPressureRange option[value=" + user.PressureRange + "]").attr("selected",
      "selected");
    $("#slcPressureRange option:selected").val(user.PressureRange);
    $("#slcPressureRange").selectmenu("refresh", true);
    $("#slcSystolic option[value=" + user.Systolic + "]").attr("selected",
      "selected");
    $("#slcSystolic option:selected").val(user.Systolic);
    $("#slcDiastolic").selectmenu("refresh", true);
    $("#slcDiastolic option[value=" + user.Diastolic + "]").attr("selected",
      "selected");
    $("#slcDiastolic option:selected").val(user.Diastolic);
    $("#slcDiastolic").selectmenu("refresh", true);
  }
}