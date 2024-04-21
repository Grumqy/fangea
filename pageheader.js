document.querySelector("header#pageheader").innerHTML = `
<nav>
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
                    <li><a href="https://grumqy.github.io/fangea/wiki/strona-glowna"><i class="fa-solid fa-house"></i><span>Strona Główna</span></a></li>
                    <li><a href="https://grumqy.github.io/fangea/mapa"><i class="fa-solid fa-map"></i><span>Mapa</span></a></li>
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
    { title: "Cartland", url: "https://grumqy.github.io/fangea/wiki/cartland" },
    { title: "Joanna „Disco Babushka” Świtek", url: "https://grumqy.github.io/fangea/wiki/disco_babushka" },
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
