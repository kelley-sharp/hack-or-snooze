class User {
  constructor(userObj, token = localStorage.getItem('token')) {
    this.username = userObj.username;
    this.name = userObj.name;
    this.favorites = userObj.favorites;
    this.ownStories = userObj.stories;
    this._loginToken = token;
    if (!this._loginToken) {
      throw new Error('User instance needs a token to be created.');
    }
    this.persist();
  }

  persist() {
    localStorage.setItem('token', this._loginToken);
    localStorage.setItem('username', this.username);
  }

  /**
   * Makes a POST request to the API. Sets login token.
   * Calls the "done" callback with a new instance of User.
   * @param {String} username
   * @param {String} password
   * @param {Function} done a callback to run when the API request finishes
   */
  static login(username, password, done) {
    $.post(`${window.API_URL}/login`, { user: { username, password } }, function(
      response
    ) {
      let loggedInUser = new User(response.user, response.token);
      done(loggedInUser);
    });
  }

  static signUp(username, password, name, signedUp) {
    $.post(
      `${window.API_URL}/signup`,
      { user: { username, password, name } },
      function(response) {
        let newUser = new User(response.user, response.token);
        signedUp(newUser);
      }
    );
  }

  static stayLoggedIn(done) {
    // check for username and token from local storage
    let username = localStorage.getItem('username');
    let token = localStorage.getItem('token');

    // if we have a username and token, we're logged in
    if (username && token) {
      let existingUser = new User({ username }, token);
      existingUser.retrieveDetails(function(updatedUser) {
        return done(updatedUser);
      });
    } else {
      // otherwise we need to log in again
      return done(null);
    }
  }

  retrieveDetails(done) {
    // make the API call
    $.get(
      `${window.API_URL}/users/${this.username}?token=${this._loginToken}`,
      response => {
        const { user } = response;
        this.username = user.username;
        this.name = user.name;
        this.favorites = user.favorites;
        this.ownStories = user.stories;
        return done(this);
      }
    );
  }

  addFavorite(storyId, done) {
    $.post(
      `${window.API_URL}/users/${this.username}/favorites/${storyId}`,
      { token: this._loginToken },
      response => this.retrieveDetails(() => done(this))
    );
  }

  removeFavorite(storyId, done) {
    $.ajax({
      url: `${window.API_URL}/users/${this.username}/favorites/${storyId}`,
      method: 'DELETE',
      data: { token: this._loginToken },
      success: response => this.retrieveDetails(() => done(this))
    });
  }
}
