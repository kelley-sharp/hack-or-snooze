class User {
  constructor(userObj) {
    this.username = userObj.username;
    this.name = userObj.name;
    this.favorites = userObj.favorites;
    this.ownStories = userObj.stories;
    this.loginToken = '';
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

  /**
   * Makes a POST request to the API. Sets login token.
   * Calls the "done" callback with a new instance of User.
   * @param {String} username 
   * @param {String} password 
   * @param {Function} done a callback to run when the API request finishes 
   */
  static login(username, password, done) {
    $.post(
      'https://hack-or-snooze-v2.herokuapp.com/login',
      { user: { username, password } },
      function(response) {
        let loggedInUser = new User(response.user);
        loggedInUser.setToken(response.token);
        done(loggedInUser);
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
}
