
class User {
  constructor(userObj) {
    this.username = userObj.username;
    this.name = userObj.name;
    this.loginToken = '';
    this.favorites = [];
    this.ownStories = [];
  }

  setToken(token) {
    this.loginToken = token;
    localStorage.setItem('token', token);
  }

  static create(username, password, name, cb) {
    $.post(
      'https://hack-or-snooze-v2.herokuapp.com/users',
      { user: { username, password, name } },
      function(response) {
        let newUser = new User(response.user);
        newUser.setToken(response.token);
        cb(newUser);
      }
    );
  }

  static login(username, password, cb) {
    $.post(
      'https://hack-or-snooze-v2.herokuapp.com/login',
      { user: { username, password } },
      function(response) {
        let loggedInUser = new User();
        loggedInUser.setToken(response.token);
        cb(loggedInUser);
      }
    );
  }

  static retrieveDetails(cb) {
    $.get('https://hack-or-snooze-v2.herokuapp.com/users', function(response) {
      let user = new User();
      user.setToken(response.token);
      user.stories = response.stories;
      user.favorites = response.favorites;
      cb(user);
    });
  }

  static render(){
    $("html").html(./login.html);
  }

}


