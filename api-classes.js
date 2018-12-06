class StoryList {
  constructor(stories = []) {
    this.stories = stories;
  }

  static getStories(cb) {
    $.get('https://hack-or-snooze-v2.herokuapp.com/stories', function(
      response
    ) {
      let storyList = new StoryList(
        response.stories.map(story => new Story(story))
      );
      cb(storyList);
    });
  }

  static addStory(currentUser, storyObj, cb){
    $.post('https://hack-or-snooze-v2.herokuapp.com/stories', function(response){
      let newStory = new Story(storyObj);
      newStory.setToken('token', response.token);
      newStory.author = response.author;
      newStory.title = response.title;
      newStory.url = response.url;

      //but the arg is a cb?
      let user = this.retrieveDetails(currentUser);
      user.stories = user.stories.unshift(newStory);

      // currentUser.retrieveDetails(function(user){
      //   user.stories.unshift(newStory);
      // });
    })
  }
}

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
}

class Story {
  constructor(storyObj) {
    this.author = storyObj.author;
    this.storyId = storyObj.storyId;
    this.title = storyObj.title;
    this.url = storyObj.url;
    this.username = storyObj.username;
  }
}
