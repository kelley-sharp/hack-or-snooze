$( document ).ready(function() {
  generateStories();

});


  
let LOGGED_IN = false;

let user;



function generateStoryHTML(story){
  const storyMarkup = 
  "<p class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray story-preview">
    <strong class="d-block text-gray-dark title">
      <i class="far fa-star"></i>
      ${story.title}
    </strong>
    <small>${story.author}</small>
    <small>${story.preview}</small>
  </p>"
  $(".story-list-area").prepend(storyMarkup);
}

//to get the list of stories
function generateStories(){
  let currentStories = StoryList.getStories();
  currentStories.stories.map(story => {
    generateStoryHTML(story);
  });
}



//when user clicks signup/login, render the correct form/html.

$('#login-submit').on('click', function(e) {
  e.preventDefault();
  let username = $('#username').val();
  let password = $('#password').val();
  $('#login-form').on('submit', function(event) {
    event.preventDefault();
    User.login(username, password, function afterYouLoggedIn(theUser) {
      // you're finally logged in
  });
})
  LOGGED_IN = true;
});


