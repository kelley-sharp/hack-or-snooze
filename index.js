let LOGGED_IN = false;

let user;

//when user clicks signup/login, render the correct form/html.

$("#login-submit").on("click", function(e){
  e.preventDefault();
  let username = $("#username").val();
  let password = $("#password").val();
  User.login(username, password);
  LOGGED_IN = true;

});





