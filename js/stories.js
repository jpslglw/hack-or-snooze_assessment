"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showBtn = false) { // adding button only to stories created by user
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  // Show the favorite/not-favorite star toggle feature if user is logged in
  const showStar = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
        <div>
        ${showStar ? getStarHTML(story, currentUser) : ""}
        ${showBtn ? getBtnHTML() : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small><br>
        <div class="story-author">by ${story.author}
        </div>
        <div class="story-user">posted by ${story.username}
        </div>
        <div>
      </li>
    `); // adding a star and button to initial HTML
}

/** Creating Star HTML */

function getStarHTML(story, user) {
  const isFavorite = user.isFavorite(story); // check of story was favoritized by user
  const starType = isFavorite ? "fas" : "far"; // star is toggled on or off and star-type added to storyMarkup
  
  return `
      <span class="star">
        <i class="${starType} fa-star"></i>
      </span>`;
}

/** Creating Button HTML */

function getBtnHTML() { 
  return `
      <span class="trash-can">
        <i class="fas fa-trash-alt"></i>
      </span>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all stories and generate HTML 
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  console.log($allStoriesList)
  $allStoriesList.show();
}

/** Creating new story submit */ 

async function addUserStoryOnPage(e) {
  console.debug("addUserStoryOnPage");
  e.preventDefault();

  // grab all info from form and send to API
    const title = $("#title").val();
    const author = $("#author").val();
    const url = $("#url").val();
    const username = currentUser.username;
    const storyData = { title, url, author, username };
    const story = await storyList.addStory(currentUser, storyData); // use addStory function defined in models.js and use the story return value.
    const $story = generateStoryMarkup(story);

    $allStoriesList.prepend($story);
    $storyForm.slideUp("slow"); // remove form after story submission
    $storyForm.trigger("reset"); // reset the form
}

$storyForm.on("submit", addUserStoryOnPage);

/** Creating favorite story toggle feature */

async function toggleFavorite(e) {
  console.debug("toggleFavorite");

  const $target = $(e.target);
  const $childLi = $target.closest('li');
  const storyId = $childLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  if ($target.hasClass("fas")) { // if already favoritized, this will be true
    await currentUser.removeFav(story); // remove story from favorites
    $target.closest("i").toggleClass("fas far");
  } else {
    await currentUser.addFav(story); // if not yet favoritized, it will be toggled on.
    $target.closest("i").toggleClass("fas far");
  }
}

$storiesLists.on("click", ".star", toggleFavorite);

/** Adding favorites on page */

function putFavsOnPage() {
  console.debug("putFavsOnPage");

  $favsLists.empty();

  if (currentUser.favorites.length === 0) { 
    $favsLists.append("No favorites added!");
  } else {
    for (let story of currentUser.favorites) { // loop through all favorite stories and generate HTML 
      const $story = generateStoryMarkup(story); 
      $favsLists.append($story);
    }
  }

  $favsLists.show(); 
  $storyForm.hide();
}

/** Remove a story */

async function removeStoriesFromPage(e) {
  console.debug("removeStoriesFromPage");

  const $target = $(e.target);
  const $childLi = $target.closest('li');
  const storyId = $childLi.attr("id");

  await storyList.removeStory(currentUser, storyId); // use removeStory function defined in models.js 
  await putUserStoriesOnPage(); // re-generate story list
}

$storiesLists.on("click", ".trash-can", removeStoriesFromPage);

/** Put user stories on page, when "My stories" in nav-bar is clicked */

function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");

  $ustoryLists.empty();

  if (currentUser.ownStories.length === 0) {
    $ustoryLists.append("No stories added by user!");
  } else {
    for (let story of currentUser.ownStories) { // loop through list of own stories and generate HTML 
      let $story = generateStoryMarkup(story, true); // enabling button feature
      $ustoryLists.append($story);
    }
  }

  $ustoryLists.show();
  $storyForm.hide();
}


