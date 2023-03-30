const pokemonRepository = (function () {
	let e = [];
	function t(t) {
		e.push(t);
	}
	function n() {
		return e;
	}
	function a(e) {
		return (
			i(),
			fetch(e.detailsUrl)
				.then(function (e) {
					return e.json();
				})
				.then(function (t) {
					(e.imageUrl = t.sprites.other.home.front_default),
						(e.height = t.height),
						(e.types = t.types),
						d();
				})
				.catch(function (e) {
					console.error(e), d();
				})
		);
	}
	function i() {
		let e = document.querySelector(".message-loading");
		e.classList.remove("hidden");
	}
	function d() {
		let e = document.querySelector(".message-loading");
		e.classList.add("hidden");
	}
	return {
		add: t,
		getAll: n,
		loadPokeListFromApi: function e() {
			return (
				i(),
				fetch("https://pokeapi.co/api/v2/pokemon/?limit=150")
					.then(function (e) {
						return e.json();
					})
					.then(function (e) {
						e.results.forEach(function (e) {
							t({ name: e.name, detailsUrl: e.url }), d();
						});
					})
					.catch(function (e) {
						console.error(e), d();
					})
			);
		},
		loadDetails: a,
		addListItem: function e(t) {
			let n = document.querySelector(".pokemon-cards"),
				i = document.createElement("div");
			i.classList.add("col-3"), n.appendChild(i);
			let d = document.createElement("div");
			d.classList.add("card"),
				d.classList.add("mb-3"),
				d.classList.add("align-self-stretch"),
				d.classList.add("text-center"),
				i.appendChild(d);
			let l = document.createElement("div");
			l.classList.add("card-body"), d.appendChild(l);
			let s = document.createElement("h5");
			s.classList.add("card-title"), (s.innerText = t.name), l.appendChild(s);
			let o = document.createElement("button");
			o.classList.add("btn"),
				o.classList.add("btn-primary"),
				(o.innerText = "Details"),
				o.setAttribute("type", "button"),
				o.setAttribute("data-bs-toggle", "modal"),
				o.setAttribute("data-bs-target", "#pokemonModal"),
				l.appendChild(o),
				(function e(t, n, i) {
					t.addEventListener(n, function (e) {
						(function e(t) {
							a(t).then(function () {
								(function e(t) {
									let n = document.querySelector("#pokemonModal");
									n.innerHTML = "";
									let a = document.createElement("div");
									a.classList.add("modal-dialog"),
										a.setAttribute("role", "document"),
										n.appendChild(a);
									let i = document.createElement("div");
									i.classList.add("modal-content"), a.appendChild(i);
									let d = document.createElement("div");
									d.classList.add("modal-header"), i.appendChild(d);
									let l = document.createElement("h1");
									l.classList.add("modal-title"),
										l.setAttribute("id", "pokemonTitle"),
										(l.innerText = t.name),
										d.appendChild(l);
									let s = document.createElement("button");
									s.classList.add("btn-close"),
										s.setAttribute("type", "button"),
										s.setAttribute("data-bs-dismiss", "modal"),
										s.setAttribute("aria-label", "Close");
									let o = document.createElement("span");
									o.setAttribute("aria-hidden", "true"),
										(o.innerHTML = "&times;"),
										s.appendChild(o),
										d.appendChild(s);
									let r = document.createElement("div");
									r.classList.add("modal-body"),
										r.classList.add("text-center"),
										i.appendChild(r);
									let c = document.createElement("img");
									c.classList.add("modal-image"), (c.src = t.imageUrl);
									let m = document.createElement("div");
									m.classList.add("modal-text");
									let p = document.createElement("h1");
									p.classList.add("modal-text"),
										(p.innerText = `Height: ${t.height} Inches`),
										m.appendChild(p),
										r.appendChild(c),
										r.appendChild(m);
									let u = document.createElement("div");
									u.classList.add("modal-footer"), i.appendChild(u);
									let h = document.createElement("button");
									h.classList.add("btn"),
										h.classList.add("btn-primary"),
										h.setAttribute("data-bs-dismiss", "modal"),
										h.setAttribute("aria-label", "Close"),
										(h.innerText = "Close"),
										u.appendChild(h),
										$("#pokemonModal").modal("show");
								})(t);
							});
						})(i);
					});
				})(o, "click", t);
		},
		search: function e(t) {
			let n = pokemonRepository.getAll().filter(function (e) {
				if (e.name.toLowerCase() === t.toLowerCase()) return e;
			});
			return n;
		},
	};
})();
pokemonRepository.loadPokeListFromApi().then(function () {
	pokemonRepository.getAll().forEach(function (e) {
		pokemonRepository.addListItem(e);
	});
});
