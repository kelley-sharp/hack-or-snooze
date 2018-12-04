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

class User {}

class Story {
  constructor(storyObj) {
    this.author = storyObj.author;
    this.storyId = storyObj.storyId;
    this.title = storyObj.title;
    this.url = storyObj.url;
    this.username = storyObj.username;
  }

}
