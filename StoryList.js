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

    })
  }
}
