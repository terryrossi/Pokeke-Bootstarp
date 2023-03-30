//
//
// Initialize list of Pokemons using IIFE to protect variables

// DOM Elements

// DATA...
const pokemonRepository = (function () {
	const pokemonList = [];
	// let pokemon = {};
	let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";

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
		showLoadingMessage();
		let url = pokemon.detailsUrl;
		return fetch(url)
			.then(function (response) {
				return response.json();
			})
			.then(function (pokemonDetails) {
				// Pokemon details received from API
				pokemon.imageUrl = pokemonDetails.sprites.other.home.front_default;
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
		// Variables from DOM Elements:
		const pokemonCards = document.querySelector(".pokemon-cards");

		const col = document.createElement("div");
		col.classList.add("col-md-3");
		col.classList.add("col-sm-6");
		col.classList.add("col-xs-12");
		pokemonCards.appendChild(col);

		// Create Card
		const card = document.createElement("div");
		card.classList.add("card");
		card.classList.add("mb-3");
		card.classList.add("align-self-stretch");
		card.classList.add("text-center");
		col.appendChild(card);

		// Create Card-body
		const cardBody = document.createElement("div");
		cardBody.classList.add("card-body");
		card.appendChild(cardBody);

		const titleH5 = document.createElement("h5");
		titleH5.classList.add("card-title");
		// add Pokemon name to card
		titleH5.innerText = pokemon.name;
		cardBody.appendChild(titleH5);

		const button = document.createElement("button");
		button.classList.add("btn");
		button.classList.add("btn-primary");
		button.innerText = "Details";
		button.setAttribute("type", "button");
		button.setAttribute("data-bs-toggle", "modal");
		button.setAttribute("data-bs-target", "#pokemonModal");
		cardBody.appendChild(button);

		// add eventListener to the Button
		addEventListenerToButton(button, "click", pokemon);
	}
	///////////////////////////////////////////////////////////////
	function addEventListenerToButton(button, type, pokemon) {
		button.addEventListener(type, function (event) {
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
		const modalContainer = document.querySelector("#pokemonModal");
		modalContainer.innerHTML = "";
		// Add Modal
		const modalDialog = document.createElement("div");
		modalDialog.classList.add("modal-dialog");
		modalDialog.setAttribute("role", "document");

		modalContainer.appendChild(modalDialog);

		const modalContent = document.createElement("div");
		modalContent.classList.add("modal-content");
		modalDialog.appendChild(modalContent);

		// Modal Header
		const modalHeader = document.createElement("div");
		modalHeader.classList.add("modal-header");
		modalContent.appendChild(modalHeader);

		const modalTitle = document.createElement("h1");
		modalTitle.classList.add("modal-title");
		// modalTitle.classList.add("text-center");
		// modalTitle.classList.add("col-12");
		// modalTitle.classList.add("text-capitalize");
		modalTitle.setAttribute("id", "pokemonTitle");
		modalTitle.innerText = pokemon.name;
		modalHeader.appendChild(modalTitle);

		// Modal Close Button
		const modalCloseButton = document.createElement("button");
		modalCloseButton.classList.add("btn-close");
		// modalCloseButton.classList.add("text-right");
		modalCloseButton.setAttribute("type", "button");
		modalCloseButton.setAttribute("data-bs-dismiss", "modal");
		modalCloseButton.setAttribute("aria-label", "Close");

		const cross = document.createElement("span");
		cross.setAttribute("aria-hidden", "true");
		cross.innerHTML = "&times;";
		modalCloseButton.appendChild(cross);

		modalHeader.appendChild(modalCloseButton);

		// Modal Body
		const modalBody = document.createElement("div");
		modalBody.classList.add("modal-body");
		modalBody.classList.add("text-center");
		modalContent.appendChild(modalBody);

		// Add Modal Items
		// const modalCloseButton = document.createElement("button");
		// modalCloseButton.classList.add("modal-close");
		// modalCloseButton.innerText = "close";

		const modalImage = document.createElement("img");
		modalImage.classList.add("modal-image");
		modalImage.src = pokemon.imageUrl;

		const modalText = document.createElement("div");
		modalText.classList.add("modal-text");

		const modalHeight = document.createElement("h1");
		modalHeight.classList.add("modal-text");
		modalHeight.innerText = `Height: ${pokemon.height} Inches`;

		modalText.appendChild(modalHeight);

		modalBody.appendChild(modalImage);
		modalBody.appendChild(modalText);

		// Modal Footer
		const modalFooter = document.createElement("div");
		modalFooter.classList.add("modal-footer");
		modalContent.appendChild(modalFooter);

		const buttonFooterClose = document.createElement("button");
		buttonFooterClose.classList.add("btn");
		buttonFooterClose.classList.add("btn-primary");
		buttonFooterClose.setAttribute("type", "button");
		buttonFooterClose.setAttribute("data-bs-dismiss", "modal");
		buttonFooterClose.setAttribute("aria-label", "Close");
		buttonFooterClose.innerText = "Close";

		modalFooter.appendChild(buttonFooterClose);

		$("#pokemonModal").modal("show");
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
//  FETCH ALL POKEMONS FROM API then SHOW ALL POKEMONS
pokemonRepository.loadPokeListFromApi().then(function () {
	pokemonRepository.getAll().forEach(function (pokemon) {
		pokemonRepository.addListItem(pokemon);
	});
});
