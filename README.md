# Pokemon Application

## Objective

**To build a small web application with HTML, CSS, BootStrap and JavaScript that loads data from an external API and enables the viewing of data points in detail.**

## Features

### User Goals

To view a list of data and see more details for a given item from the Pokemon API on demand.

### Key Features

- Includes a Header with links to Github and Portfolio
- Load data (Fetch) from an external source (API).
- View a list of items.
- Create Pagination based on total number of items.
- Create a Search field alowing search criterias on item names.
- On user action (e.g., by clicking on a list item), view Additional details for that item found on a second API.
- Includes a footer

### Technical Environment

- The app loads data from an external API; for instance: "https://pokeapi.co/api/v2/pokemon";

- The app displays a list of items loaded from that API after the page is loaded.
- The App includes a Pagination Feature using a Bootstrap Navbar.
- The pagination is also available for searched items.
- The Display is done using Bootstrap Cards.
- The App enables the viewing of more details for a given list item on
  demand, such as when clicking on a list item through a Modal Window.
- The additional Details are shown through a Bootstrap Modal.
- The Modal window needs to close automatically through 3 inputs: click outside the window, click on close button on top right corner and escape key.
- The app has additional CSS styling.
- The JavaScript code is formatted according to ESLint rules.
  1. The JavaScript code is formatted via Prettier.
- The app shows loading indicators while loading data.
- The app handles errors (such as trying to search with no search criteria) and show user-friendly error messages.
- The app handles network errors (such as network offline)
- The app allows searching for items (e.g., searching for a string of character in the name).
- The app includes a ShowAll Button to allow user to go back to the full list after searching for a smaller subset.
- The app is designed to only execute 1 call (fetch) to each API.
- The app is deployed to GitHub Pages.
