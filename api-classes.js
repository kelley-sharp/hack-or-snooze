class StoryList {
  constructor() {
    this.stories = []
  }

  static getStories(cb) {
    $.get('https://hack-or-snooze-v2.herokuapp.com/stories', function(response){
      console.log(response);
      var storyList = new StoryList();
      // set stories
      cb(storyList);
    });
  }
  

}

class User {}

class Story {
  constructor() {
    this.author = author;
    this.title = title;
    this.url = url;
    this.username = username;
    this.storyId = id;
  }
}
