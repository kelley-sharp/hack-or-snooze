/* Global Variables */

let LOGGED_IN = false;

// current user
let user;
// list of stories
let currentStoryList;

// attempt to grab token and get user info ASAP
user = User.stayLoggedIn(function(existingUser) {
  user = existingUser;
  console.log(user);
  LOGGED_IN = true;
});

/* On Page Load */
$(document).ready(function() {
  onlyShowStories();

  /* nav-link event listeners */

  $('#news-feed-link').on('click', function() {
    onlyShowStories();
  });
  $('#sign-up-link').on('click', function() {
    onlyShowSignUp();
  });
  $('#login-link').on('click', function() {
    onlyShowLogin();
  });
  $('#my-stories-link').on('click', function() {
    onlyShowMyStories();
  });
  $('#favorites-link').on('click', function() {
    onlyShowFavorites();
  });
  $('.fa-star').on('click', function() {
    toggleFavorite();
  });

  /* form event listeners */
  //when user submits new-story form, sends new story to the StoryList addStory method
  $('#new-story-form').on('submit', submitNewStory);

  //when user submits login form, run User login method.
  $('#login-form').on('submit', function(event) {
    event.preventDefault();
    let username = $('#login-username').val();
    let password = $('#login-password').val();
    User.login(username, password, function afterYouLoggedIn(theUser) {
      $('#login-link').text('Logout');
      user = theUser;
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
});

//show only stories
function onlyShowStories() {
  //show stories
  generateStories();
  $('#stories-content').removeClass('d-none');
  //hide all the other stuff
  $('#login-content').addClass('d-none');
  $('#sign-up-content').addClass('d-none');
  $('#my-stories-content').addClass('d-none');
  $('#favorites-content').addClass('d-none');
}

function onlyShowSignUp() {
  //show sign up form
  $('#sign-up-content').removeClass('d-none');
  //hide all the other stuff
  $('#stories-content').addClass('d-none');
  $('#login-content').addClass('d-none');
  $('#my-stories-content').addClass('d-none');
  // $('#favorites-content').addClass('d-none');
}

function onlyShowLogin() {
  //show login form
  $('#login-content').removeClass('d-none');
  //hide all the other stuff
  $('#stories-content').addClass('d-none');
  $('#sign-up-content').addClass('d-none');
  $('#my-stories-content').addClass('d-none');
  $('#favorites-content').addClass('d-none');
}

function onlyShowMyStories() {
  if (LOGGED_IN !== true) {
    alert('You must be logged in to post stories.');
  } else {
    //show new story form & my stories
    $('#my-stories-content').removeClass('d-none');
    user.ownStories.forEach(story => {
      let storyMarkup = generateStoryHTML(story);
      $('#posted-story-list-area').append(storyMarkup);
    });
    //hide everything else
    $('#stories-content').addClass('d-none');
    $('#login-content').addClass('d-none');
    $('#sign-up-content').addClass('d-none');
    $('#favorites-content').addClass('d-none');
  }
}

function onlyShowFavorites() {
  if (LOGGED_IN !== true) {
    alert('You must be logged in to favorite stories.');
  } else {
    //show favorites
    $('#favorites-content').removeClass('d-none');
    user.favorites.forEach(story => {
      let storyMarkup = generateStoryHTML(story);
      $('#favorites-list-area').append(storyMarkup);
    });
    //hide everything else
    $('#stories-content').addClass('d-none');
    $('#login-content').addClass('d-none');
    $('#sign-up-content').addClass('d-none');
    $('#my-stories-content').addClass('d-none');
  }
}

// function toggleFavorite() {
//   //toggle star icon
//   $('.fa-star').toggleClass('fas');
//   let story = $(this).parent();
//   // add to user.favorites
//   if ($(this).hasClass('fas')) {
//   } else {
//     // remove from user.favorites
//     user.favorites.shift(story);
//   }
// }

//helper function to show story html
function generateStoryHTML(story) {
  const storyMarkup = `<p class="media-body pb-3 pt-3 mb-0 small lh-125 border-bottom border-gray story-preview">
    <strong class="d-block text-gray-dark title">
      <i class="far fa-star"></i>
      ${story.title}
    </strong>
    <small>posted by: ${story.author}</small>
  </p>`;
  return storyMarkup;
}

//to get the list of stories
function generateStories() {
  StoryList.getStories(function handleResponse(currentStories) {
    currentStoryList = currentStories;
    currentStoryList.stories.forEach(story => {
      let storyMarkup = generateStoryHTML(story);
      $('#story-list-area').append(storyMarkup);
    });
  });
}

function submitNewStory(event) {
  event.preventDefault();

  // get form data
  let title = $('#new-story-title').val();
  let author = $('#new-story-author').val();
  let url = $('#new-story-url').val();

  // make a new story
  let newStoryObj = { title, author, url };

  currentStoryList.addStory(user, newStoryObj, function afterYouAddedStory() {
    $('new-story-content').addClass('d-none');
    $('#stories-content').removeClass('d-none');
    generateStories();
  });
}
