class StoryList {
  constructor(stories = []) {
    this.stories = stories;
  }

  static getStories(cb) {
    $.get('https://hack-or-snooze-v2.herokuapp.com/stories', function(
      response
    ) {
      var storyList = new StoryList(
        response.stories.map(story => new Story(story))
      );
      cb(storyList);
    });
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
