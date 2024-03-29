"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  $storyForm.hide();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $storyForm.hide();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $storyForm.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** Let user see story submit form */

function navSubmitClick(evt) {
  console.debug("navSubmitClick");
  hidePageComponents();
  $storyForm.show();
}

$navSubmit.on("click", navSubmitClick);

/** Let user see his favorite stories */

function navFavsClick(evt) {
  console.debug("navFavsClick", evt);
  hidePageComponents();
  putFavsOnPage();
}

$navFavs.on("click", navFavsClick);

/** Let user see his own stories */

function navUstoryClick(evt) {
  console.debug("navUstoryClick", evt);
  hidePageComponents();
  putUserStoriesOnPage();
}

$navUstories.on("click", navUstoryClick);