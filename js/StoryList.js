const API_URL = 'https://hack-or-snooze-v2.herokuapp.com';

class StoryList {
  constructor(stories = []) {
    this.stories = stories;
  }

  static getStories(done) {
    $.get(`${API_URL}/stories`, function processResponse(response) {
      let storyList = new StoryList(
        response.stories.map(story => new Story(story))
      );
      done(storyList);
    });
  }

  static addStory(currentUser, storyObj, theStoryIsReadyNow) {
    $.post(`${API_URL}/stories`, function(response) {
      let newStory = new Story(storyObj);
      newStory.setToken('token', response.token);
      newStory.author = response.author;
      newStory.title = response.title;
      newStory.url = response.url;

      theStoryIsReadyNow(newStory);

      //but the arg is a cb?
      let user = this.retrieveDetails(currentUser);
      user.stories = user.stories.unshift(newStory);

    });
  }
}
