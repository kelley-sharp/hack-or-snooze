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

  addStory(currentUser, storyObj, theStoryIsReadyNow) {
    let storyPostBody = { story: storyObj, token: currentUser.loginToken };

    $.post(`${API_URL}/stories`, storyPostBody, (response) => {
      // instantiate a story using the response
      let newStory = new Story(response.story);
      // update the user (to add to my stories)
      currentUser.retrieveDetails(() => {
        // add the new story to this StoryList
        this.stories.unshift(newStory);
        // pass the newly-created story to the callback
        theStoryIsReadyNow(newStory);
      });
    });
  }
}
