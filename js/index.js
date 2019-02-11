/* 
global User
global StoryList
*/

/* Global Variables */

let LOGGED_IN = false;

// current user
let user = null;
// list of stories
let currentStoryList;

let $body = $("body");

$(document).on({
  ajaxStart: function() { $body.addClass("loading");},
  ajaxStop: function() { $body.removeClass("loading"); }    
});

/* On Page Load */
$(document).ready(function() {

  // attempt to grab token and get user info ASAP
  user = User.stayLoggedIn(function(existingUser) {
    user = existingUser;
    if (user) {
      LOGGED_IN = true;
      $('#login-link').text('Logout');
    } else {
      user = null;
      LOGGED_IN = false;
      $('#login-link').text('Login');
    }
    onlyShowStories();
  });


  /* nav-link event listeners */

  $('#news-feed-link').on('click', function() {
    onlyShowStories();
  });
  $('#sign-up-link').on('click', function() {
    onlyShowSignUp();
  });
  $('#login-link').on('click', function() {
    handleLoginLogout ();
  });
  $('#my-stories-link').on('click', function() {
    onlyShowMyStories();
  });
  $('#favorites-link').on('click', function() {
    onlyShowFavorites();
  });
  $('#stories-content').on('click', function(event) {
    if (LOGGED_IN) {
      toggleFavorite(event);
    } else {
      let target = $( event.target );
      let $more = $('#more-link-newsfeed');
      if (!target.is($more)){
        alert('You must be logged in to favorite stories!');
      }
    }
  });

  /* form event listeners */
  //when user submits new-story form, sends new story to the StoryList addStory method
  $('#new-story-form').on('submit', submitNewStory);

  /* other event listeners */
  $('#more-link-newsfeed').click(function(){
    let toSkip = $('#story-list-area p').length
    generateStories(toSkip);
    $('html, body').animate({
      scrollTop:$(document).height()-$(window).height()},
      "swing");
  });

  // post a new story adds story to My stories under form
  $('#btn__submit-story').click(function(){
    location.reload();
  })

  //LOGIN: when user submits login form, run User login method.
  $('#login-form').on('submit', function(event) {
    event.preventDefault();
    let username = $('#login-username').val();
    let password = $('#login-password').val();
    User.login(username, password, function afterYouLoggedIn(theUser) {
      user = theUser;
      LOGGED_IN = true;
      $('#login-link').text('Logout');
      onlyShowStories();
    });
  });

  //when user submits sign-up, run User sign-in method.
  $('#sign-up-form').on('submit', function(e) {
    e.preventDefault();
    let username = $('#signup-username').val();
    let password = $('#signup-password').val();
    let name = $('#signup-name').val();

    User.signUp(username, password, name, function afterYouSignedIn(newUser) {
      alert('Thank you for signing up! You can now post stories and add stories to your favorites.')
      LOGGED_IN = true;
      user = newUser;
      $('#login-link').text('Logout');
    });
  });
});

//
function handleLoginLogout() {
  $('#login-link').addClass("active");

  // if logged in... call loggout and show logged out message
  if (LOGGED_IN){
    LOGGED_IN = false;
    user = null;
    alert('You have successfully logged out!')
    $('#login-link').text('Login');
  }
  onlyShowLogin();
}

//show only stories
function onlyShowStories() {
  //if there aren't already stories on the page generate them.
  if ($('#story-list-area p').length == 0){
    generateStories();
  }

  //show stories
  $('#stories-content').removeClass('d-none');
  $('#news-feed-link').addClass("active");

  //hide all the other stuff
  $('#login-content').addClass('d-none');
  $('#sign-up-content').addClass('d-none');
  $('#my-stories-content').addClass('d-none');
  $('#favorites-content').addClass('d-none');
  //remove active class from other stuff
  $('#favorites-link').removeClass("active");
  $('#my-stories-link').removeClass("active");
  $('#login-link').removeClass("active");
}

function onlyShowSignUp() {
  //show sign up form
  $('#sign-up-content').removeClass('d-none');
  //hide all the other stuff
  $('#stories-content').addClass('d-none');
  $('#login-content').addClass('d-none');
  $('#my-stories-content').addClass('d-none');
  $('#favorites-content').addClass('d-none');
}

function onlyShowLogin() {
  
  //show login form
  $('#login-content').removeClass('d-none');
  $('#login-link').addClass("active");

  //hide all the other stuff
  $('#stories-content').addClass('d-none');
  $('#sign-up-content').addClass('d-none');
  $('#my-stories-content').addClass('d-none');
  $('#favorites-content').addClass('d-none');
  //turn active off other links
  $('#favorites-link').removeClass("active");
  $('#news-feed-link').removeClass("active");
  $('#my-stories-link').removeClass("active");
}

function onlyShowMyStories() {
  if (LOGGED_IN === false) {
    alert('You must be logged in to post stories.');
  } else if (LOGGED_IN === true) {
    //show new story form & my stories
    $('#my-stories-content').removeClass('d-none');
    $("#my-stories-link").addClass('active');

    user.ownStories.forEach(story => {
      let storyMarkup = generateStoryHTML(story);
      $('#posted-story-list-area').prepend(storyMarkup);
    });
    //hide everything else
    $('#stories-content').addClass('d-none');
    $('#login-content').addClass('d-none');
    $('#sign-up-content').addClass('d-none');
    $('#favorites-content').addClass('d-none');
    //remove active class from other stuff
    $('#favorites-link').removeClass("active");
    $('#news-feed-link').removeClass("active");
    $('#login-link').removeClass("active");
  }
}

function onlyShowFavorites() {
  if (LOGGED_IN === false) {
    alert('You must be logged in to favorite stories.');
  } else {
    //show favorites
    $('#favorites-content').removeClass('d-none');
    $('#favorites-list-area').empty();
    $('#favorites-link').addClass('active');
    user.favorites.forEach(story => {
      let storyMarkup = generateStoryHTML(story);
      $('#favorites-list-area').append(storyMarkup);
    });
    //hide everything else
    $('#stories-content').addClass('d-none');
    $('#login-content').addClass('d-none');
    $('#sign-up-content').addClass('d-none');
    $('#my-stories-content').addClass('d-none');
    //remove active class from other stuff
    $('#my-stories-link').removeClass("active");
    $('#news-feed-link').removeClass("active");
    $('#login-link').removeClass("active");
  }
}

function toggleFavorite(event) {
  let storyId = event.target.id;

  //if DOES NOT HAVE solid star, add it and add to favorites, update user.
  if (!$(event.target).hasClass('fas')) {
    user.addFavorite(storyId, function afterFavoriteAdded(
      userWithAddedFavorite
    ) {
      user = userWithAddedFavorite;
      $(event.target).addClass('fas');
    });
  } else {
    //if the story HAS solid star, remove it, remove from favorites, update user.
    user.removeFavorite(storyId, function afterFavoriteRemoved(
      userWithRemovedFavorite
    ) {
      user = userWithRemovedFavorite;
      $(event.target).removeClass('fas');
    });
  }
}

//helper functions to show story html

function getLocation(href) {
  var l = document.createElement('a');
  l.href = href;
  return l;
}

function generateStoryHTML(story) {
  let storyMarkup;
  let location = getLocation(story.url);
  let hostname = location.hostname;

  if (LOGGED_IN && user.favorites.find(s => s.storyId === story.storyId)) {
    storyMarkup = `<p class="media-body pb-3 pt-3 mb-0 small lh-125 border-bottom border-gray">
      <strong class="d-block text-gray-dark title">
        <i id='${story.storyId}'class="far fa-star fas"></i>
        ${story.title} 
        <small><a href='${story.url}'>(${hostname})</a></small>
      </strong>
      <small>posted by: ${story.author}</small>
    </p>`;
  } else {
    storyMarkup = `<p class="media-body pb-3 pt-3 mb-0 small lh-125 border-bottom border-gray">
      <strong class="d-block text-gray-dark title">
        <i id='${story.storyId}'class="far fa-star"></i>
        ${story.title}
        <small><a href='${story.url}'>(${hostname})</a></small>
      </strong>
      <small>posted by: ${story.author}</small>
    </p>`;
  }
  return storyMarkup;
}

//to get the list of stories
function generateStories(toSkip) {
  StoryList.getStories(toSkip, function handleResponse(currentStories) {
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
  let username = user.username;
  let title = $('#new-story-title').val();
  let author = $('#new-story-author').val();
  let url = $('#new-story-url').val();

  // make a new story
  let newStoryObj = { username, title, author, url };

  currentStoryList.addStory(user, newStoryObj, function afterYouAddedStory() {
    $('#posted-story-list-area').append(newStoryObj);
    generateStories();
  });
}
