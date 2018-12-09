let LOGGED_IN = false;

let user;

//when user clicks signup/login, render the correct form/html.

$('#login-submit').on('click', function(e) {
  e.preventDefault();
  let username = $('#username').val();
  let password = $('#password').val();
  $('#login-form').on('submit', function(event) {
    event.preventDefault();
    User.login(username, password, function afterYouLoggedIn(theUser) {
      // you're finally logged in
  });
})
  LOGGED_IN = true;
});
