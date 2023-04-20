//
//
// Initialize list of Pokemons using IIFE to protect variables

const pokemonRepository = (function () {
	// DOM ELEMENTS
	const messageBox = document.getElementById('message-warning');
	const paginationBar = document.querySelector('.pagination');

	// VARIABLES
	// Full list of Pokemons
	let pokemonList = [];

	// API
	const maxNumberOfPokemons = 500;
	let apiUrl = `https://pokeapi.co/api/v2/pokemon/?limit=${maxNumberOfPokemons}`;

	// FUNCTIONS...

	//////////////////////////////////////////////
	// Adds a Pokemon to the Pokemon List
	function add(pokemon) {
		pokemonList.push(pokemon);
	}
	///////////////////////////////////////////////
	// Returns the Full List of Pokemons SORTED
	function getSortedPokemons() {
		const pokemonListSorted = pokemonList.sort((a, b) => (a.name > b.name ? 1 : -1));
		return pokemonListSorted;
	}
	////////////////////////////////////////////////
	// Fetch the Pokemons from the API and creates the Pokemon Full List
	function loadPokeListFromApi() {
		showLoadingMessage();
		pokemonList = [];

		return fetch(apiUrl)
			.then(function (response) {
				return response.json();
			})
			.then(function (json) {
				json.results.forEach(function (item) {
					let pokemon = {
						name: item.name,
						detailsUrl: item.url,
					};
					add(pokemon);
					hideLoadingMessage();
				});
			})
			.catch(function (e) {
				console.error(e);
				pokemonRepository.errorMessage('Network Error! Please Verify your Internet connection.');
				hideLoadingMessage();
			});
	}

	////////////////////////////////////////////////
	// fetch pokemon Additional details from Second API
	function loadDetails(pokemon) {
		showLoadingMessage();
		let url = pokemon.detailsUrl;
		return fetch(url)
			.then(function (response) {
				return response.json();
			})
			.then(function (pokemonDetails) {
				// Pokemon details received from API
				pokemon.imageUrl = pokemonDetails.sprites.other.dream_world.front_default;
				pokemon.height = pokemonDetails.height;
				pokemon.types = pokemonDetails.types;
				hideLoadingMessage();
			})
			.catch(function (e) {
				console.error(e);
				pokemonRepository.errorMessage('Network Error! Please Verify your Internet connection.');
				hideLoadingMessage();
			});
	}
	////////////////////////////////////////////////
	// Creates the HTML ELEMENT showing each Pokemon
	function addListItem(pokemon) {
		// Get Pokemon Element from the DOM
		const pokemonCards = document.querySelector('.pokemon-cards');

		const col = document.createElement('div');
		col.classList.add('col-md-3');
		col.classList.add('col-sm-6');
		col.classList.add('col-xs-12');
		pokemonCards.appendChild(col);

		// Create Card
		const card = document.createElement('div');
		card.classList.add('card');
		card.classList.add('mb-3');
		card.classList.add('align-self-stretch');
		card.classList.add('text-center');
		col.appendChild(card);

		// Create Card-body
		const cardBody = document.createElement('div');
		cardBody.classList.add('card-body');
		card.appendChild(cardBody);

		const titleH5 = document.createElement('h5');
		// add Pokemon name to card
		titleH5.innerText = pokemon.name;
		cardBody.appendChild(titleH5);

		// add Details Button to open Modal
		const button = document.createElement('button');
		button.classList.add('btn');
		button.classList.add('btn-primary');
		button.innerText = 'Details';
		button.setAttribute('type', 'button');
		button.setAttribute('data-bs-toggle', 'modal');
		button.setAttribute('data-bs-target', '#pokemonModal');
		cardBody.appendChild(button);

		// add eventListener to the Details Button to show Modal
		button.addEventListener('click', function (event) {
			event.preventDefault();
			showDetails(pokemon);
		});
	}

	///////////////////////////////////////////////////////////////
	// shows Pokemon details (MODAL) when Pokemon clicked on
	function showDetails(pokemon) {
		loadDetails(pokemon).then(function () {
			showModal(pokemon);
		});
	}
	///////////////////////////////////////////////////////////////
	// MODAL
	function showModal(pokemon) {
		// CamelCase Converter (For multiple words)
		const camelFunction = function (name) {
			const words = name.split(' ');
			const wordsCamel = [];
			for (const w of words) {
				wordsCamel.push(w.slice(0, 1).toUpperCase() + w.slice(1));
			}
			return wordsCamel.join(' ');
		};
		// Building the Modal
		const modalTitle = document.querySelector('#pokemonTitle');
		modalTitle.innerText = camelFunction(pokemon.name);

		const modalImage = document.querySelector('#modal-image');
		modalImage.setAttribute('src', pokemon.imageUrl);
		modalImage.setAttribute('alt', 'Pokemon Image Front');

		const modalHeight = document.querySelector('#modal-heigth');
		modalHeight.innerText = `Height: ${pokemon.height} Inches`;

		// $('#pokemonModal').modal('toggle');
	}

	////////////////////////////////////////////////////////////////
	function showLoadingMessage() {
		errorMessage('Loading...');
	}
	////////////////////////////////////////////////////////////////
	function hideLoadingMessage() {
		messageBox.innerHTML = '';
	}
	////////////////////////////////////////////////////////////////
	// ERROR MESSAGE
	function errorMessage(message) {
		const messageWarning = document.createElement('div');
		messageWarning.classList.add('alert');
		messageWarning.classList.add('alert-warning');
		messageWarning.classList.add('col-5');
		messageWarning.classList.add('text-center');
		messageWarning.setAttribute('role', 'alert');
		messageWarning.innerText = message;
		messageBox.appendChild(messageWarning);
	}
	//////////////////////////////////////////////////////////////
	// RESET DOM ELEMENTS
	function resetDomElements() {
		pokemonCards.innerHTML = '';
		messageBox.innerHTML = '';
	}
	///////////////////////////////////////////////////////////////
	//  FETCH ALL POKEMONS FROM API Creates Pokemon Full List and Shows 1st page
	function show1stPage(currentPage) {
		let page = currentPage - 1;

		let start = pokemonsPerPage * page;
		let end = start + pokemonsPerPage;

		loadPokeListFromApi().then(function () {
			pokemonRepository
				.getSortedPokemons()
				.slice(start, end)
				.forEach(function (pokemon) {
					addListItem(pokemon);
				});
			// We have to call setupPagination within the Promise to make sure the initial list of pokemon is returned
			// This won't apply to the next pages as they will not fetch the API anymore. They will access the already created listOfPokemons
			setupPagination(pokemonRepository.getSortedPokemons(), paginationBar, currentPage);
		});
	}
	///////////////////////////////////////////////////////////////
	//  Shows other pages using existing pokemon list instead of fetching again
	function showPage(listOfPokemons, currentPage) {
		let page = currentPage - 1;

		let start = pokemonsPerPage * page;
		let end = start + pokemonsPerPage;

		listOfPokemons.slice(start, end).forEach(function (pokemon) {
			addListItem(pokemon);
		});

		// setupPagination(listOfPokemons, pokemonRepository.paginationBar, currentPage);
	}
	////////////////////////////////////////////////////////////////
	// Setup PAgination Nav Bar
	function setupPagination(listOfPokemons, element, currentPage) {
		element.innerHTML = '';
		let pageCount = Math.ceil(listOfPokemons.length / pokemonsPerPage);
		for (let i = 1; i <= pageCount; i++) {
			let btn = createPaginationButton(listOfPokemons, i, currentPage);
			element.appendChild(btn);
		}
	}
	/////////////////////////////////////////////////////////////////
	// Create each NavBar Pagination Button
	function createPaginationButton(listOfPokemons, page, currentPage) {
		const buttonLiTag = document.createElement('li');
		buttonLiTag.classList.add('page-item');

		const buttonATag = document.createElement('a');
		buttonATag.classList.add('page-link');
		buttonATag.setAttribute('href', '#');
		buttonATag.innerText = page;

		buttonLiTag.appendChild(buttonATag);

		if (currentPage == page) {
			buttonLiTag.classList.add('active');
		}

		buttonLiTag.addEventListener('click', function () {
			resetDomElements();

			currentPage = page;
			showPage(listOfPokemons, currentPage);

			let currentButton = document.querySelector('.page-item.active');
			currentButton.classList.remove('active');
			this.classList.add('active');
		});
		return buttonLiTag;
	}
	////////////////////////////////////////////////////////////////

	return {
		getSortedPokemons,
		show1stPage,
		showPage,
		setupPagination,
		paginationBar,
		errorMessage,
		resetDomElements,
	};
})();
//
///////////////////////   END OF IIFE POKEMON INITIALIZATION FUNCTIONS  ////////////////////

///////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////// PROGRAM FLOW... ///////////////////////////////
//
//
// DOM ELEMENTS
const pokemonCards = document.querySelector('.pokemon-cards');
const searchButton = document.getElementById('search');
const showAllButton = document.getElementById('show-all');
const inputSearch = document.getElementById('search-input');

// Pagination variables:
let currentPage = 1;
let pokemonsPerPage = 16;

// Initial page load creates Full list of Pokemons, shows first page and Pagination NavBar.
pokemonRepository.show1stPage(currentPage);

// SHOW ALL POKEMONS Button
showAllButton.addEventListener('click', function (e) {
	e.preventDefault();

	pokemonRepository.resetDomElements();
	pokemonRepository.paginationBar.innerHTML = '';
	inputSearch.value = '';

	currentPage = 1;
	// shows first again + Pagination NavBar.
	pokemonRepository.show1stPage(currentPage);
});

// SEARCH POKEMONS (when Search Button is clicked)
searchButton.addEventListener('click', function (e) {
	e.preventDefault();

	pokemonRepository.resetDomElements();
	pokemonRepository.paginationBar.innerHTML = '';

	// Check if input field is empty to avoid refetching the same Pokemons
	if (!inputSearch.value) {
		pokemonRepository.errorMessage('Please Enter a Search Criteria!');
	} else {
		// Fetch Pokemon name containing search criterias
		let listOfPkemonFound = [];
		listOfPkemonFound = pokemonRepository.getSortedPokemons().filter(function (pokemon) {
			if (pokemon.name.includes(inputSearch.value)) {
				return pokemon;
			}
		});

		if (listOfPkemonFound) {
			currentPage = 1;
			pokemonRepository.showPage(listOfPkemonFound, currentPage);
			pokemonRepository.setupPagination(
				listOfPkemonFound,
				pokemonRepository.paginationBar,
				currentPage
			);
		}
	}
});

// SEARCH POKEMONS (when Enter key is pressed)
inputSearch.addEventListener('keypress', function (e) {
	if (e.key === 'Enter') {
		e.preventDefault();
		pokemonRepository.resetDomElements();
		pokemonRepository.paginationBar.innerHTML = '';

		// Check if input field is empty to avoid refetching the same Pokemons
		if (!inputSearch.value) {
			pokemonRepository.errorMessage('Please Enter a Search Criteria!');
		} else {
			// Fetch Pokemon name containing search criterias
			let listOfPkemonFound = [];
			listOfPkemonFound = pokemonRepository.getSortedPokemons().filter(function (pokemon) {
				if (pokemon.name.includes(inputSearch.value)) {
					return pokemon;
				}
			});

			if (listOfPkemonFound) {
				currentPage = 1;
				pokemonRepository.showPage(listOfPkemonFound, currentPage);
				pokemonRepository.setupPagination(
					listOfPkemonFound,
					pokemonRepository.paginationBar,
					currentPage
				);
			}
		}
	}
});
