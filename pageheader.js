document.querySelector("header#pageheader").innerHTML = `
<nav>
            <a href="https://grumqy.github.io/fangea/strona-glowna">
            <section id="pageheader-logo">
                <img src="/fangea/local/logo.svg" alt="Logo"/>
                <span>Fangea i inne kontynenty</span>
            </section>
            <section id="pageheader-search">
                <div id="search-container">
                    <input type="text" id="search-input" placeholder="Wyszukaj..." />
                    <div id="search-results"></div>
                </div>
            </section>
            <section id="pageheader-menu">
                <ul>
                <li><a href="https://grumqy.github.io/fangea/mapa/"><i class="fa-solid fa-map"></i><span>Mapa</span></a></li>
                <li><a href="https://grumqy.github.io/fangea/radio/stacje_radiowe/"><i class="fa-solid fa-radio"></i><span>Radio</span></a></li>
                 </ul>
            </section>
        </nav>`;
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");

searchInput.addEventListener("input", function () {
  const query = this.value.trim().toLowerCase();
  searchResults.innerHTML = "";
  searchResults.style.display = "none";
  if (query.length > 0) {
    simulateSearchResults(query);
  }
});

function simulateSearchResults(query) {
  const articles = [
    { title: "Rzeczpospolita Pampersia", url: "https://grumqy.github.io/fangea/wiki/pampersia" },
    { title: "Konfederacja Montecydyjska", url: "https://grumqy.github.io/fangea/wiki/montecydja" },
    { title: "Wielka Republika Nadmorska", url: "https://grumqy.github.io/fangea/wiki/nadmorze" },
    { title: "Cartland", url: "https://grumqy.github.io/fangea/wiki/cartland" },
    { title: "Joanna „Disco Babushka” Świtek", url: "https://grumqy.github.io/fangea/wiki/disco_babushka" },
    { title: "Richteryzm", url: "https://grumqy.github.io/fangea/wiki/richteryzm" },
    { title: "Ajjbdalizm (religia)", url: "https://grumqy.github.io/fangea/wiki/ajjbdalizm_religia" },
  ];

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(query)
  );

  if (filteredArticles.length > 0) {
    filteredArticles.forEach((article) => {
      const articleElement = document.createElement("div");
      const linkElement = document.createElement("a");
      linkElement.href = article.url;
      linkElement.textContent = article.title;
      articleElement.appendChild(linkElement);
      searchResults.appendChild(articleElement);
      searchResults.style.display = "block";
    });
  } else {
    const noResultsElement = document.createElement("div");
    noResultsElement.textContent = "Brak wyników";
    noResultsElement.classList = "noresults";
    searchResults.appendChild(noResultsElement);
    searchResults.style.display = "block";
  }
}
