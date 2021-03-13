/*
  Assignment: Blood Pressure App
  Author: Kylie Gregory
  Date: 8/16/2020
  Purpose: To provide the functionality for the password entry keypad and to
    handle verifying the user password before proceeding.
*/

/*
  addValueToPassword takes in a value representing the key pressed.  If it is
  'bksp' we remove the last character of the value in the passcode element.
  Otherwise, we concatenate the value onto the end of the current value in the
  passcode element.
*/
function addValueToPassword(key) {
  var currVal = $("#passcode").val();
  if (key == 'bksp') {
    $("#passcode").val(currVal.substring(0, currVal.length - 1));
  } else {
    $("#passcode").val(currVal.concat(key));
  }
}

/*
  getPassword will check if local storage is available. If it's not, it will 
  alert the user. Otherwise, it will check to see if a user's password exists
  in local storage.  If it does, it will return that password.  Otherwise, it
  will return a default password.
*/
function getPassword() {
  if (typeof(Storage) == "undefined") {
    alert("Your browser does not support HTML5 localStorage.  Try upgrading.");
  } else if (localStorage.getItem("user") != null) {
    return JSON.parse(localStorage.getItem("user")).NewPassword;
  } else {
    return "2345"; // default password
  }
}

/*
  Add an onclick function to the btnEnter element.  It will get the value of 
  the passcode element and call getPassword to check if the values match. If
  they do match, then it will proceed into the app. If they don't match, it
  will alert the user to try again.
*/
$("#btnEnter").click( function() {
  var enteredPasscode = $("#passcode").val();
  var storedPasscode = getPassword();

  if(enteredPasscode == storedPasscode) {
    // check if they have agreed to the legal disclaimer
    if (localStorage.getItem("agreedToLegal") == null) {
      $("#btnEnter").attr("href", "#legalNotice").button();
    } else if (localStorage.getItem("agreedToLegal") == "true") {
      // check if a user profile has been saved yet
      if (localStorage.getItem("user") == null) {
        $("#btnEnter").attr("href", "#pageUserInfo").button();
      } else {
        $("#btnEnter").attr("href", "#pageMenu").button();
      }
    }
  } else {
    alert("Incorrect password, please try again.");
  }
});

/*
  Add an onclick function to the noticeYes element.  It will store a value of
  true for the itme agreedToLegal in localStorage
*/
$("#noticeYes").click( function() {
  try {
    localStorage.setItem("agreedToLegal", "true");
  }  catch(e) {
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