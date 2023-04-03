//
//
// Initialize list of Pokemons using IIFE to protect variables

const pokemonRepository = (function () {
	let pokemonList = [];
	let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

	// FUNCTIONS...
	function add(pokemon) {
		pokemonList.push(pokemon);
	}
	///////////////////////////////////////////////
	function getAll() {
		return pokemonList;
	}
	////////////////////////////////////////////////
	function loadPokeListFromApi() {
		// Fetch Pokemons from API
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
				hideLoadingMessage();
			});
	}

	////////////////////////////////////////////////
	function loadDetails(pokemon) {
		// fetch pokemon Additional details from Second API
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
				hideLoadingMessage();
			});
	}
	////////////////////////////////////////////////
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
	function showDetails(pokemon) {
		// shows details when Pokemon clicked on
		loadDetails(pokemon).then(function () {
			showModal(pokemon);
		});
	}
	///////////////////////////////////////////////////////////////
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

		const modalHeight = document.querySelector('#modal-heigth');
		modalHeight.innerText = `Height: ${pokemon.height} Inches`;
		modalHeight.innerText = 'Height: Inches';

		// $('#pokemonModal').modal('toggle');
	}

	///////////////////////////////////////////////////////////////
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
		const messageLoading = document.querySelector('.message-loading');
		messageLoading.classList.remove('hidden');
	}
	////////////////////////////////////////////////////////////////
	function hideLoadingMessage() {
		const messageLoading = document.querySelector('.message-loading');
		messageLoading.classList.add('hidden');
	}
	////////////////////////////////////////////////////////////////
	//////////   POINTER EVENTS FOR MOBILE DEVICES    //////////////

	return {
		add,
		getAll,
		loadPokeListFromApi,
		loadDetails,
		addListItem,
		search,
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
const messageBox = document.getElementById('message-warning');

//  FETCH ALL POKEMONS FROM API for initial page view
function showAll() {
	pokemonRepository.loadPokeListFromApi().then(function () {
		pokemonRepository.getAll().forEach(function (pokemon) {
			pokemonRepository.addListItem(pokemon);
		});
	});
}
showAll();

// SHOW ALL POKEMONS Button
showAllButton.addEventListener('click', function (e) {
	e.preventDefault();
	pokemonCards.innerHTML = '';
	showAll();
});

// SEARCH POKEMONS (when Search Button is clicked)
searchButton.addEventListener('click', function (e) {
	e.preventDefault();

	messageBox.innerHTML = '';

	// Check if input field is empty to avoid refetching the same Pokemons
	if (!inputSearch.value) {
		const messageWarning = document.createElement('div');
		messageWarning.classList.add('alert');
		messageWarning.classList.add('alert-warning');
		messageWarning.classList.add('col-5');
		messageWarning.classList.add('text-center');
		messageWarning.setAttribute('role', 'alert');
		messageWarning.innerText = 'Please Enter a Search Criteria!';
		messageBox.appendChild(messageWarning);
	} else {
		// Fetch Pokemon name containing search criterias
		let listOfPkemonFound = [];
		listOfPkemonFound = pokemonRepository.getAll().filter(function (pokemon) {
			if (pokemon.name.includes(inputSearch.value)) {
				return pokemon.name;
			}
		});
		// If Pokemons found from search, Show searched Pokemons
		if (listOfPkemonFound) {
			// Delete previous list of Cards on the DOM
			pokemonCards.innerHTML = '';
			// Create a New list of Pokemons
			listOfPkemonFound.forEach(function (pokemon) {
				pokemonRepository.addListItem(pokemon);
			});
		}
	}
});
