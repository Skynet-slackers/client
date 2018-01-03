'use strict';

var app = app || {};

(function(module) {
  const userView = {};

  function resetView() {
    $('.content').hide();
  }

  // Show the Video Feed
  userView.initFeedView = () => {
    resetView();
    $('.logout-div').show();
    $('.search-view').show();
    $('.logout-btn').one('click', function(event){
      event.preventDefault();
      // Remove logged in user for localstorage
      module.User.logout()
      page('/');
    });
    $('.search-form').on('submit', function(event) {
      event.preventDefault();
      let searchValue = $('.search-form input[name="search"]').val();
      let searchValueObj = {
        search: searchValue
      }
      console.log('search for ')
      console.log(searchValueObj)
      module.Video.search(searchValueObj);
    });
  };

  // Show video list
  userView.initVideoList = () => {
    resetView();
    $('.video-view').show()
    let template = Handlebars.compile($('.video-list-template').text());
    $('.video-list').append(template(app.Video.all[0]));
  }

  // Show the Signin view
  userView.initSigninView = () => {
    resetView();

    // Clear out the current signin fields
    $('.signin-form input[name="username"]').val('');
    $('.signin-form input[name="password"]').val('');

    // Show the signin form
    $('.signin-section').show();

    // Set a signin event handler on the signin button once
    $('.signin-form').one('submit', function(e) {
      e.preventDefault();
      let username = e.target.username.value;
      let password = e.target.password.value;
      module.User.fetch(username, password, module.User.validate);
    });
  };

  userView.initSignupView = () => {
    resetView();

    // Clear out the current signup fields
    $('.signup-form input[name="username"]').val('');
    $('.signup-form input[name="password"]').val('');

    // Show the signup form
    $('.signup-section').show();

    // Set a signup event handler on the signup button once
    $('.signup-form').one('submit', function(e) {
      e.preventDefault();
      let realname = e.target.realname.value;
      let username = e.target.username.value;
      let password = e.target.password.value;
      module.User.fetch(username, {
        'realname': realname,
        'password': password
      }, module.User.create);
    });
  };

  userView.initIndexPage = () => {
    // If a user is logged in already immediately navigate to /feed
    if (localStorage.uvueUser) {
      console.log(`Found a logged in user ${localStorage.uvueUser}`)
      // If their was a user logged in previously, try to fetch the user
      module.User.fetch(JSON.parse(localStorage.uvueUser), null,
        () => page(`/user/${JSON.parse(localStorage.uvueUser)}/feed`));
    } else {
      page('/signin');
    }
  };

  module.userView = userView;
})(app);
