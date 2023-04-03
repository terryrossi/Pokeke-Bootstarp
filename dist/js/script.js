const pokemonRepository = (function () {
		let e = [];
		function t(t) {
			e.push(t);
		}
		function n() {
			return e;
		}
		function o(e) {
			return (
				i(),
				fetch(e.detailsUrl)
					.then(function (e) {
						return e.json();
					})
					.then(function (t) {
						(e.imageUrl = t.sprites.other.dream_world.front_default),
							(e.height = t.height),
							(e.types = t.types),
							s();
					})
					.catch(function (e) {
						console.error(e), s();
					})
			);
		}
		function i() {
			let e = document.querySelector('.message-loading');
			e.classList.remove('hidden');
		}
		function s() {
			let e = document.querySelector('.message-loading');
			e.classList.add('hidden');
		}
		return {
			add: t,
			getAll: n,
			loadPokeListFromApi: function n() {
				return (
					i(),
					(e = []),
					fetch('https://pokeapi.co/api/v2/pokemon/?limit=150')
						.then(function (e) {
							return e.json();
						})
						.then(function (e) {
							e.results.forEach(function (e) {
								t({ name: e.name, detailsUrl: e.url }), s();
							});
						})
						.catch(function (e) {
							console.error(e), s();
						})
				);
			},
			loadDetails: o,
			addListItem: function e(t) {
				let n = document.querySelector('.pokemon-cards'),
					i = document.createElement('div');
				i.classList.add('col-md-3'),
					i.classList.add('col-sm-6'),
					i.classList.add('col-xs-12'),
					n.appendChild(i);
				let s = document.createElement('div');
				s.classList.add('card'),
					s.classList.add('mb-3'),
					s.classList.add('align-self-stretch'),
					s.classList.add('text-center'),
					i.appendChild(s);
				let r = document.createElement('div');
				r.classList.add('card-body'), s.appendChild(r);
				let a = document.createElement('h5');
				(a.innerText = t.name), r.appendChild(a);
				let l = document.createElement('button');
				l.classList.add('btn'),
					l.classList.add('btn-primary'),
					(l.innerText = 'Details'),
					l.setAttribute('type', 'button'),
					l.setAttribute('data-bs-toggle', 'modal'),
					l.setAttribute('data-bs-target', '#pokemonModal'),
					r.appendChild(l),
					l.addEventListener('click', function (e) {
						e.preventDefault(),
							(function e(t) {
								o(t).then(function () {
									(function e(t) {
										let n = document.querySelector('#pokemonTitle');
										n.innerText = (function (e) {
											let t = e.split(' '),
												n = [];
											for (let o of t)
												n.push(o.slice(0, 1).toUpperCase() + o.slice(1));
											return n.join(' ');
										})(t.name);
										let o = document.querySelector('#modal-image');
										o.setAttribute('src', t.imageUrl);
										o.setAttribute('alt', 'Pokemon Image Front');
										let i = document.querySelector('#modal-heigth');
										(i.innerText = `Height: ${t.height} Inches`),
											(i.innerText = 'Height: Inches');
									})(t);
								});
							})(t);
					});
			},
			search: function e(t) {
				let n = pokemonRepository.getAll().filter(function (e) {
					if (e.name.toLowerCase() === t.toLowerCase()) return e;
				});
				return n;
			},
		};
	})(),
	pokemonCards = document.querySelector('.pokemon-cards'),
	searchButton = document.getElementById('search'),
	showAllButton = document.getElementById('show-all'),
	inputSearch = document.getElementById('search-input'),
	messageBox = document.getElementById('message-warning');
function showAll() {
	pokemonRepository.loadPokeListFromApi().then(function () {
		pokemonRepository.getAll().forEach(function (e) {
			pokemonRepository.addListItem(e);
		});
	});
}
showAll(),
	showAllButton.addEventListener('click', function (e) {
		e.preventDefault(), (pokemonCards.innerHTML = ''), showAll();
	}),
	searchButton.addEventListener('click', function (e) {
		if ((e.preventDefault(), (messageBox.innerHTML = ''), inputSearch.value)) {
			let t = [];
			(t = pokemonRepository.getAll().filter(function (e) {
				if (e.name.includes(inputSearch.value)) return e.name;
			})) &&
				((pokemonCards.innerHTML = ''),
				t.forEach(function (e) {
					pokemonRepository.addListItem(e);
				}));
		} else {
			let n = document.createElement('div');
			n.classList.add('alert'),
				n.classList.add('alert-warning'),
				n.classList.add('col-5'),
				n.classList.add('text-center'),
				n.setAttribute('role', 'alert'),
				(n.innerText = 'Please Enter a Search Criteria!'),
				messageBox.appendChild(n);
		}
	});
