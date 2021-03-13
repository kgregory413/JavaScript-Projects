/*
  Author: Kylie Gregory
  Date: 7/25/2020
  Credit: Based on Physics Projectile App in Chapter 3 of Building 
    Cross-Platform Mobile and Web Apps for Engineers and Scientists: An Active
    Learning Approach , 1st Edition by Pawan Lingras; Matt Triff; Rucha Lingras
  Purpose: Provide functions for performing calculations for calculating the number of days remaining until one's birthday.
*/

/*
  calculateBirthday will get the amount of days between the start date and a birthday, as entered by the user.
*/
function calculateBirthday(){
    var startDateElement = document.getElementById("startDate");
    var startDate = Date.parse(startDateElement.value);
    var birthDateElement = document.getElementById("birthDate");
    var birthDate = Date.parse(birthDateElement.value);
    
    var birthday = birthDate - startDate;
    birthday = birthday / (1000 * 3600 * 24);

    var birthdayElement = document.getElementById("birthday");
    birthdayElement.innerHTML = birthday;
}