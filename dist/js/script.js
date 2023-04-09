const pokemonRepository = (function () {
		let e = document.getElementById('message-warning'),
			t = document.querySelector('.pagination'),
			o = [];
		function n(e) {
			o.push(e);
		}
		function r(e) {
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
						console.error(e),
							pokemonRepository.errorMessage(
								'Network Error! Please Verify your Internet connection.'
							),
							s();
					})
			);
		}
		function i() {
			a('Loading...');
		}
		function s() {
			e.innerHTML = '';
		}
		function a(e) {
			let t = document.createElement('div');
			t.classList.add('alert'),
				t.classList.add('alert-warning'),
				t.classList.add('col-5'),
				t.classList.add('text-center'),
				t.setAttribute('role', 'alert'),
				(t.innerText = e),
				pokemonRepository.messageBox.appendChild(t);
		}
		function l(e, t) {
			let o = pokemonsPerPage * --t;
			e.slice(o, o + pokemonsPerPage).forEach(function (e) {
				pokemonRepository.addListItem(e);
			});
		}
		function c(e) {
			let t = document.createElement('li');
			t.classList.add('page-item');
			let o = document.createElement('a');
			return (
				o.classList.add('page-link'),
				o.setAttribute('href', '#'),
				(o.innerText = e),
				t.appendChild(o),
				currentPage == e && t.classList.add('active'),
				t.addEventListener('click', function () {
					pokemonRepository.resetDomElements(),
						(currentPage = e),
						l(pokemonRepository.listOfPokemons, currentPage);
					document.querySelector('.page-item.active').classList.remove('active'),
						this.classList.add('active');
				}),
				t
			);
		}
		return {
			add: n,
			getAll: function e() {
				let t = o.sort((e, t) => (e.name > t.name ? 1 : -1));
				return t;
			},
			loadPokeListFromApi: function e() {
				return (
					i(),
					(o = []),
					fetch('https://pokeapi.co/api/v2/pokemon/?limit=150')
						.then(function (e) {
							return e.json();
						})
						.then(function (e) {
							e.results.forEach(function (e) {
								n({ name: e.name, detailsUrl: e.url }), s();
							});
						})
						.catch(function (e) {
							console.error(e),
								pokemonRepository.errorMessage(
									'Network Error! Please Verify your Internet connection.'
								),
								s();
						})
				);
			},
			loadDetails: r,
			addListItem: function e(t) {
				let o = document.querySelector('.pokemon-cards'),
					n = document.createElement('div');
				n.classList.add('col-md-3'),
					n.classList.add('col-sm-6'),
					n.classList.add('col-xs-12'),
					o.appendChild(n);
				let i = document.createElement('div');
				i.classList.add('card'),
					i.classList.add('mb-3'),
					i.classList.add('align-self-stretch'),
					i.classList.add('text-center'),
					n.appendChild(i);
				let s = document.createElement('div');
				s.classList.add('card-body'), i.appendChild(s);
				let a = document.createElement('h5');
				(a.innerText = t.name), s.appendChild(a);
				let l = document.createElement('button');
				l.classList.add('btn'),
					l.classList.add('btn-primary'),
					(l.innerText = 'Details'),
					l.setAttribute('type', 'button'),
					l.setAttribute('data-bs-toggle', 'modal'),
					l.setAttribute('data-bs-target', '#pokemonModal'),
					s.appendChild(l),
					l.addEventListener('click', function (e) {
						e.preventDefault(),
							(function e(t) {
								r(t).then(function () {
									(function e(t) {
										let o = document.querySelector('#pokemonTitle');
										o.innerText = (function (e) {
											let t = e.split(' '),
												o = [];
											for (let n of t)
												o.push(n.slice(0, 1).toUpperCase() + n.slice(1));
											return o.join(' ');
										})(t.name);
										let n = document.querySelector('#modal-image');
										n.setAttribute('src', t.imageUrl),
											n.setAttribute('alt', 'Pokemon Image Front');
										let r = document.querySelector('#modal-heigth');
										r.innerText = `Height: ${t.height} Inches`;
									})(t);
								});
							})(t);
					});
			},
			search: function e(t) {
				let o = pokemonRepository.getAll().filter(function (e) {
					if (e.name.toLowerCase() === t.toLowerCase()) return e;
				});
				return o;
			},
			show1stPage: function e(t) {
				let o = pokemonsPerPage * --t,
					n = o + pokemonsPerPage;
				pokemonRepository.loadPokeListFromApi().then(function () {
					pokemonRepository
						.getAll()
						.slice(o, n)
						.forEach(function (e) {
							pokemonRepository.addListItem(e);
						});
				});
			},
			showPage: l,
			setupPagination: function e(t, o) {
				o.innerHTML = '';
				let n = Math.ceil(t / pokemonsPerPage);
				for (let r = 1; r <= n; r++) {
					let i = c(r);
					o.appendChild(i);
				}
			},
			messageBox: e,
			paginationBar: t,
			errorMessage: a,
			resetDomElements: function t() {
				(pokemonCards.innerHTML = ''), (e.innerHTML = '');
			},
			maxNumberOfPokemons: 150,
			listOfPokemons: [],
		};
	})(),
	pokemonCards = document.querySelector('.pokemon-cards'),
	searchButton = document.getElementById('search'),
	showAllButton = document.getElementById('show-all'),
	inputSearch = document.getElementById('search-input');
let currentPage = 1,
	pokemonsPerPage = 16;
pokemonRepository.show1stPage(currentPage),
	pokemonRepository.setupPagination(
		pokemonRepository.maxNumberOfPokemons,
		pokemonRepository.paginationBar
	),
	(pokemonRepository.listOfPokemons = pokemonRepository.getAll()),
	console.log(pokemonRepository.listOfPokemons.length),
	showAllButton.addEventListener('click', function (e) {
		e.preventDefault(),
			pokemonRepository.resetDomElements(),
			(pokemonRepository.paginationBar.innerHTML = ''),
			(inputSearch.value = ''),
			(currentPage = 1),
			(pokemonRepository.listOfPokemons = pokemonRepository.getAll()),
			pokemonRepository.show1stPage(currentPage),
			pokemonRepository.setupPagination(
				pokemonRepository.listOfPokemons.length,
				pokemonRepository.paginationBar
			);
	}),
	searchButton.addEventListener('click', function (e) {
		if (
			(e.preventDefault(),
			pokemonRepository.resetDomElements(),
			(pokemonRepository.paginationBar.innerHTML = ''),
			inputSearch.value)
		) {
			let t = [];
			(t = pokemonRepository.getAll().filter(function (e) {
				if (e.name.includes(inputSearch.value)) return e;
			})) &&
				((currentPage = 1),
				pokemonRepository.showPage(t, currentPage),
				pokemonRepository.setupPagination(t.length, pokemonRepository.paginationBar));
		} else pokemonRepository.errorMessage('Please Enter a Search Criteria!');
	});
