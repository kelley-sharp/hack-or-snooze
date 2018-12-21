$(document).ready(function() {
  generateStories();
});

let LOGGED_IN = false;

let user;

// nav-link event listeners
$('#news-feed-link').on('click', function() {
  generateStories();
});
$('.sign-up-link').on('click', function() {
  $('#sign-up-content').toggleClass('d-none');
  $('#stories-content').addClass('d-none');
  $('#login-content').toggleClass('d-none');
});
$('#login-link').on('click', function() {
  $('#login-content').toggleClass('d-none');
  $('#stories-content').addClass('d-none');
});
$('#new-story-link').on('click', function() {
  $('#new-story-form')
    .removeClass('d-none')
    .addClass('d-block');
  $('#stories-content').addClass('d-none');
});

//helper function to show story html
function generateStoryHTML(story) {
  const storyMarkup = `<p class="media-body pb-3 pt-3 mb-0 small lh-125 border-bottom border-gray story-preview">
    <strong class="d-block text-gray-dark title">
      <i class="far fa-star"></i>
      ${story.title}
    </strong>
    <small>posted by: ${story.author}</small>
  </p>`;
  $('.story-list-area').append(storyMarkup);
}

//to get the list of stories
function generateStories() {
  StoryList.getStories(function handleResponse(currentStories) {
    currentStories.stories.forEach(story => {
      generateStoryHTML(story);
    });
  });
}

//when user submits login form, run User login method.
$('#login-form').on('submit', function(event) {
  event.preventDefault();
  let username = $('#login-form.username').val();
  let password = $('#login-form.password').val();
  
  User.login(username, password, function afterYouLoggedIn(theUser) {
    $('#login-link').text('Logout');
  });

  LOGGED_IN = true;
});

//when user submits sign-up, run User sign-in method.
$('#sign-up-form').on('submit', function(e) {
  e.preventDefault();
  let username = $('#signup-username').val();
  let password = $('#signup-password').val();
  let name = $('#signup-name').val();

  User.signUp(username, password, name, function afterYouSignedIn(newUser) {
    
    $('#main-content').html(
      '<h6>Thank you for signing up!</h6><small>You can now post stories and add stories to your favorites.</small>'
    );

    $('#login-link').text('Logout');
  });

  LOGGED_IN = true;
});
