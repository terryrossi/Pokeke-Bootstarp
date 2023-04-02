//
//
// Initialize list of Pokemons using IIFE to protect variables

// DOM Elements

// DATA...
const pokemonRepository = (function () {
	const pokemonList = [];
	// let pokemon = {};
	let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=1";

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
		console.log("loadPokeListFromApi()...");
		showLoadingMessage();

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
		// fetch pokemon detail from API
		console.log("loadDetails(pokemon)...");
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
	function addListItem(pokemon, pokemonCards) {
		// Variables from DOM Elements:
		// const pokemonCards = document.querySelector(".pokemon-cards");

		// const col = document.createElement("div");
		// col.classList.add("col-md-3");
		// col.classList.add("col-sm-6");
		// col.classList.add("col-xs-12");
		// pokemonCards.appendChild(col);

		// Create Card
		// const card = document.createElement("div");
		// card.classList.add("card");
		// card.classList.add("mb-3");
		// card.classList.add("align-self-stretch");
		// card.classList.add("text-center");
		// col.appendChild(card);

		// Create Card-body
		// const cardBody = document.createElement("div");
		// cardBody.classList.add("card-body");
		// card.appendChild(cardBody);

		// const titleH5 = document.createElement("h5");
		// titleH5.classList.add("card-title");

		// add Pokemon name to card
		// titleH5.innerText = pokemon.name;
		// cardBody.appendChild(titleH5);

		// add Details Button to open Modal
		const button = document.getElementById("buttonModal");

		button.addEventListener("click", function (event) {
			event.preventDefault();
			console.log("button clicked to go to showdetails...");
			showDetails(pokemon);
		});
	}

	///////////////////////////////////////////////////////////////
	function showDetails(pokemon) {
		console.log("in showdetails...");
		// shows details when Pokemon clicked on
		loadDetails(pokemon).then(function () {
			console.log("going to showModal...");
			showModal(pokemon);
		});
	}
	///////////////////////////////////////////////////////////////
	function showModal(pokemon) {
		const modalContainer = document.querySelector("#pokemonModal");

		// modalContainer.innerHTML = "";

		const modalTitle = document.querySelector("#pokemonTitle");
		modalTitle.innerText = pokemon.name;

		const modalImage = document.querySelector("#modal-image");
		modalImage.setAttribute("src", pokemon.imageUrl);

		const modalHeight = document.querySelector("#modal-heigth");
		modalHeight.innerText = `Height: ${pokemon.height} Inches`;
		modalHeight.innerText = `Height: Inches`;

		$("#pokemonModal").modal("toggle");
		// modalContainer.show();
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
		const messageLoading = document.querySelector(".message-loading");
		messageLoading.classList.remove("hidden");
	}
	////////////////////////////////////////////////////////////////
	function hideLoadingMessage() {
		const messageLoading = document.querySelector(".message-loading");
		messageLoading.classList.add("hidden");
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
// DOM ELEMENT FOR POKEMONS
const pokemonCards = document.querySelector(".pokemon-cards");

//  FETCH ALL POKEMONS FROM API
pokemonRepository.loadPokeListFromApi().then(function () {
	pokemonRepository.getAll().forEach(function (pokemon) {
		pokemonRepository.addListItem(pokemon, pokemonCards);
	});
});
// Check for search input DOM Element
const pokemonSearchForm = document.getElementById("search-form");
pokemonSearchForm.addEventListener("submit", function (e) {
	e.preventDefault;
	const inputSearch = document.getElementById("search-input");

	// Check for searched Pokemon
	const listOfPkemonFound = pokemonRepository.getAll().filter(function (pokemon) {
		if (pokemon.name.includes(inputSearch.value)) {
			return pokemon.name;
		}
	});

	// If Pokemons found from search, Show searched Pokemons
	if (listOfPkemonFound) {
		// Delete previous list of Cards on the DOM
		pokemonCards.innerHTML = "";

		listOfPkemonFound.forEach(function (pokemon) {
			pokemonRepository.addListItem(pokemon, pokemonCards);
		});
	}
});
