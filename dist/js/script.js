const pokemonRepository = (function () {
		let e = document.getElementById('message-warning'),
			t = document.querySelector('.pagination'),
			n = [];
		function o(e) {
			let t = document.querySelector('.pokemon-cards'),
				n = document.createElement('div');
			n.classList.add('col-md-3'),
				n.classList.add('col-sm-6'),
				n.classList.add('col-xs-12'),
				t.appendChild(n);
			let o = document.createElement('div');
			o.classList.add('card'),
				o.classList.add('mb-3'),
				o.classList.add('align-self-stretch'),
				o.classList.add('text-center'),
				n.appendChild(o);
			let i = document.createElement('div');
			i.classList.add('card-body'), o.appendChild(i);
			let s = document.createElement('h5');
			(s.innerText = e.name), i.appendChild(s);
			let l = document.createElement('button');
			l.classList.add('btn'),
				l.classList.add('btn-primary'),
				(l.innerText = 'Details'),
				l.setAttribute('type', 'button'),
				l.setAttribute('data-bs-toggle', 'modal'),
				l.setAttribute('data-bs-target', '#pokemonModal'),
				i.appendChild(l),
				l.addEventListener('click', function (t) {
					t.preventDefault(),
						(function e(t) {
							var n;
							((n = t),
							r(),
							fetch(n.detailsUrl)
								.then(function (e) {
									return e.json();
								})
								.then(function (e) {
									(n.imageUrl = e.sprites.other.dream_world.front_default),
										(n.height = e.height),
										(n.types = e.types),
										a();
								})
								.catch(function (e) {
									console.error(e),
										pokemonRepository.errorMessage(
											'Network Error! Please Verify your Internet connection.'
										),
										a();
								})).then(function () {
								(function e(t) {
									let n = document.querySelector('#pokemonTitle');
									n.innerText = (function (e) {
										let t = e.split(' '),
											n = [];
										for (let o of t) n.push(o.slice(0, 1).toUpperCase() + o.slice(1));
										return n.join(' ');
									})(t.name);
									let o = document.querySelector('#modal-image');
									o.setAttribute('src', t.imageUrl), o.setAttribute('alt', 'Pokemon Image Front');
									let r = document.querySelector('#modal-heigth');
									r.innerText = `Height: ${t.height} Inches`;
								})(t);
							});
						})(e);
				});
		}
		function r() {
			i('Loading...');
		}
		function a() {
			e.innerHTML = '';
		}
		function i(t) {
			let n = document.createElement('div');
			n.classList.add('alert'),
				n.classList.add('alert-warning'),
				n.classList.add('col-5'),
				n.classList.add('text-center'),
				n.setAttribute('role', 'alert'),
				(n.innerText = t),
				e.appendChild(n);
		}
		function s() {
			(pokemonCards.innerHTML = ''), (e.innerHTML = '');
		}
		function l(e, t) {
			let n = pokemonsPerPage * (t - 1);
			e.slice(n, n + pokemonsPerPage).forEach(function (e) {
				o(e);
			});
		}
		function c(e, t, n) {
			t.innerHTML = '';
			let o = Math.ceil(e.length / pokemonsPerPage);
			for (let r = 1; r <= o; r++) {
				let a = p(e, r, n);
				t.appendChild(a);
			}
		}
		function p(e, t, n) {
			let o = document.createElement('li');
			o.classList.add('page-item');
			let r = document.createElement('a');
			return (
				r.classList.add('page-link'),
				r.setAttribute('href', '#'),
				(r.innerText = t),
				o.appendChild(r),
				n == t && o.classList.add('active'),
				o.addEventListener('click', function () {
					s(), l(e, (n = t));
					document.querySelector('.page-item.active').classList.remove('active'),
						this.classList.add('active');
				}),
				o
			);
		}
		return {
			getSortedPokemons: function e() {
				let t = n.sort((e, t) => (e.name > t.name ? 1 : -1));
				return t;
			},
			show1stPage: function e(i) {
				let s = pokemonsPerPage * (i - 1),
					l = s + pokemonsPerPage;
				(r(),
				(n = []),
				fetch('https://pokeapi.co/api/v2/pokemon/?limit=500')
					.then(function (e) {
						return e.json();
					})
					.then(function (e) {
						e.results.forEach(function (e) {
							var t;
							(t = { name: e.name, detailsUrl: e.url }), n.push(t), a();
						});
					})
					.catch(function (e) {
						console.error(e),
							pokemonRepository.errorMessage(
								'Network Error! Please Verify your Internet connection.'
							),
							a();
					})).then(function () {
					pokemonRepository
						.getSortedPokemons()
						.slice(s, l)
						.forEach(function (e) {
							o(e);
						}),
						c(pokemonRepository.getSortedPokemons(), t, i);
				});
			},
			showPage: l,
			setupPagination: c,
			paginationBar: t,
			errorMessage: i,
			resetDomElements: s,
		};
	})(),
	pokemonCards = document.querySelector('.pokemon-cards'),
	searchButton = document.getElementById('search'),
	showAllButton = document.getElementById('show-all'),
	inputSearch = document.getElementById('search-input');
let currentPage = 1,
	pokemonsPerPage = 16;
pokemonRepository.show1stPage(currentPage),
	showAllButton.addEventListener('click', function (e) {
		e.preventDefault(),
			pokemonRepository.resetDomElements(),
			(pokemonRepository.paginationBar.innerHTML = ''),
			(inputSearch.value = ''),
			(currentPage = 1),
			pokemonRepository.show1stPage(currentPage);
	}),
	searchButton.addEventListener('click', function (e) {
		if (
			(e.preventDefault(),
			pokemonRepository.resetDomElements(),
			(pokemonRepository.paginationBar.innerHTML = ''),
			inputSearch.value)
		) {
			let t = [];
			(t = pokemonRepository.getSortedPokemons().filter(function (e) {
				if (e.name.includes(inputSearch.value)) return e;
			})) &&
				((currentPage = 1),
				pokemonRepository.showPage(t, currentPage),
				pokemonRepository.setupPagination(t, pokemonRepository.paginationBar, currentPage));
		} else pokemonRepository.errorMessage('Please Enter a Search Criteria!');
	}),
	inputSearch.addEventListener('keypress', function (e) {
		if ('Enter' === e.key) {
			if (
				(e.preventDefault(),
				pokemonRepository.resetDomElements(),
				(pokemonRepository.paginationBar.innerHTML = ''),
				inputSearch.value)
			) {
				let t = [];
				(t = pokemonRepository.getSortedPokemons().filter(function (e) {
					if (e.name.includes(inputSearch.value)) return e;
				})) &&
					((currentPage = 1),
					pokemonRepository.showPage(t, currentPage),
					pokemonRepository.setupPagination(t, pokemonRepository.paginationBar, currentPage));
			} else pokemonRepository.errorMessage('Please Enter a Search Criteria!');
		}
	});
