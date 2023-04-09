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
	// Variable list of pokemons (full or searched)
	let listOfPokemons = [];
	const maxNumberOfPokemons = 150;
	let apiUrl = `https://pokeapi.co/api/v2/pokemon/?limit=${maxNumberOfPokemons}`;

	// FUNCTIONS...

	//////////////////////////////////////////////
	// Adds a Pokemon to the Pokemon List
	function add(pokemon) {
		pokemonList.push(pokemon);
	}
	///////////////////////////////////////////////
	// Returns the Full List of Pokemons SORTED
	function getAll() {
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
				pokemonRepository.errorMessage(
					'Network Error! Please Verify your Internet connection.'
				);
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
				pokemonRepository.errorMessage(
					'Network Error! Please Verify your Internet connection.'
				);
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

	///////////////////////////////////////////////////////////////
	// Search for specific Pokemons (by name)
	function search(searchName) {
		// Find Pokemon
		const foundPokemon = pokemonRepository.getAll().filter(function (pokemon) {
			if (pokemon.name.toLowerCase() === searchName.toLowerCase()) {
				return pokemon;
			}
		});
		return foundPokemon;
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
		pokemonRepository.messageBox.appendChild(messageWarning);
	}
	//////////////////////////////////////////////////////////////
	// RESET DOM ELEMENTS
	function resetDomElements() {
		pokemonCards.innerHTML = '';
		messageBox.innerHTML = '';
	}
	///////////////////////////////////////////////////////////////
	//  FETCH ALL POKEMONS FROM API Creates Pokemon Full List and Shows 1st page
	function show1stPage(page) {
		page--;

		let start = pokemonsPerPage * page;
		let end = start + pokemonsPerPage;

		pokemonRepository.loadPokeListFromApi().then(function () {
			pokemonRepository
				.getAll()
				.slice(start, end)
				.forEach(function (pokemon) {
					pokemonRepository.addListItem(pokemon);
				});
		});
	}
	///////////////////////////////////////////////////////////////
	//  Shows other pages using existing pokemon list instead of fetching again
	function showPage(listOfPokemons, page) {
		page--;

		let start = pokemonsPerPage * page;
		let end = start + pokemonsPerPage;

		listOfPokemons.slice(start, end).forEach(function (pokemon) {
			pokemonRepository.addListItem(pokemon);
		});
	}
	////////////////////////////////////////////////////////////////
	// Setup PAgination Nav Bar
	function setupPagination(numberOfPokemons, element) {
		element.innerHTML = '';
		let pageCount = Math.ceil(numberOfPokemons / pokemonsPerPage);
		for (let i = 1; i <= pageCount; i++) {
			let btn = createPaginationButton(i);
			element.appendChild(btn);
		}
	}
	/////////////////////////////////////////////////////////////////
	// Create each NavBar Pagination Button
	function createPaginationButton(page) {
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
			pokemonRepository.resetDomElements();

			currentPage = page;
			showPage(pokemonRepository.listOfPokemons, currentPage);

			let currentButton = document.querySelector('.page-item.active');
			currentButton.classList.remove('active');

			this.classList.add('active');
		});
		return buttonLiTag;
	}
	////////////////////////////////////////////////////////////////

	return {
		add,
		getAll,
		loadPokeListFromApi,
		loadDetails,
		addListItem,
		search,
		show1stPage,
		showPage,
		setupPagination,
		messageBox,
		paginationBar,
		errorMessage,
		resetDomElements,
		maxNumberOfPokemons,
		listOfPokemons,
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

// Reset DOM Elements
// pokemonRepository.resetDomElements();

// Pagination variables:
let currentPage = 1;
let pokemonsPerPage = 16;

// Initial page load shows first 1 page.
pokemonRepository.show1stPage(currentPage);

pokemonRepository.setupPagination(
	pokemonRepository.maxNumberOfPokemons,
	pokemonRepository.paginationBar
);
pokemonRepository.listOfPokemons = pokemonRepository.getAll();
// Due to Promise, listOfPokemons.length always = 0 :(
console.log(pokemonRepository.listOfPokemons.length);

// SHOW ALL POKEMONS Button
showAllButton.addEventListener('click', function (e) {
	e.preventDefault();

	pokemonRepository.resetDomElements();
	pokemonRepository.paginationBar.innerHTML = '';
	inputSearch.value = '';

	currentPage = 1;
	pokemonRepository.listOfPokemons = pokemonRepository.getAll();
	pokemonRepository.show1stPage(currentPage);
	pokemonRepository.setupPagination(
		pokemonRepository.listOfPokemons.length,
		pokemonRepository.paginationBar
	);
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
		listOfPkemonFound = pokemonRepository.getAll().filter(function (pokemon) {
			if (pokemon.name.includes(inputSearch.value)) {
				return pokemon;
			}
		});

		if (listOfPkemonFound) {
			currentPage = 1;
			pokemonRepository.showPage(listOfPkemonFound, currentPage);
			pokemonRepository.setupPagination(
				listOfPkemonFound.length,
				pokemonRepository.paginationBar
			);
		}
	}
});
