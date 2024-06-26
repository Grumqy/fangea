document.querySelector("header#pageheader").innerHTML = `
<nav>
            <a href="https://grumqy.github.io/fangea/">
            <section id="pageheader-logo">
                <img src="/fangea/local/logo.svg" alt="Logo"/>
                <span>Fangea i inne kontynenty</span>
                </section>
            </a>
            <section id="pageheader-search">
                <div id="search-container">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input type="text" id="search-input" placeholder="Wyszukaj artykuł..." />
                    <div id="search-results">
                    <div id="search-results-list"></div>
                    </div>
                </div>
            </section>
<section id="pageheader-menu">
                <ul>
                  <li><a href="https://grumqy.github.io/fangea/wiki/"><i class="fa-solid fa-book"></i><span>Wiki</span></a></li>
                  <li><a href="https://grumqy.github.io/fangea/mapa/"><i class="fa-solid fa-map"></i><span>Mapa</span></a></li>
                  <li><a href="https://grumqy.github.io/fangea/waluty/"><i class="fa-solid fa-coins"></i></i><span>Waluty</span></a></li>
                </ul>
            </section>
        </nav>`;
const searchContainer = document.getElementById("search-container");
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");
const searchResultsList = document.getElementById("search-results-list");

searchInput.addEventListener("input", function () {
  const query = this.value.trim().toLowerCase();
  searchResultsList.innerHTML = "";
  searchResults.style.display = "none";
  searchContainer.classList.remove("active");
  if (query.length > 0) {
    simulateSearchResults(query);
  }
});

function simulateSearchResults(query) {
  const articles = [
    { title: "Pampersia", url: "https://grumqy.github.io/fangea/wiki/pampersia" },
    { title: "Montecydia", url: "https://grumqy.github.io/fangea/wiki/montecydia" },
    { title: "Nadmorze", url: "https://grumqy.github.io/fangea/wiki/nadmorze" },
    { title: "Cartland", url: "https://grumqy.github.io/fangea/wiki/cartland" },
    { title: "Joanna „Disco Babushka” Świtek", url: "https://grumqy.github.io/fangea/wiki/disco_babushka" },
    { title: "Richteryzm", url: "https://grumqy.github.io/fangea/wiki/richteryzm" },
    { title: "Ajjbdalizm (religia)", url: "https://grumqy.github.io/fangea/wiki/ajjbdalizm_religia" },
    { title: "Mirosław Długoszyjny", url: "https://grumqy.github.io/fangea/wiki/mirosław_długoszyjny" },
    { title: "Port Złotice", url: "https://grumqy.github.io/fangea/wiki/port_złotice/" },
    { title: "Łukasz Lukasox", url: "https://grumqy.github.io/fangea/wiki/łukasz_lukasox/" },
    { title: "Andannajwa Lidi", url: "https://grumqy.github.io/fangea/wiki/andannajwa_lidi/" },
    { title: "Izydor Nwm Ktoś", url: "https://grumqy.github.io/fangea/wiki/izydor_nwm_ktoś/" },
    { title: "Wojna domowa w Wizgardzie", url: "https://grumqy.github.io/fangea/wiki/wojna_domowa_w_wizgardzie/" },
    { title: "Lemburg", url: "https://grumqy.github.io/fangea/wiki/lemburg/" },
    { title: "Ergonbud", url: "https://grumqy.github.io/fangea/wiki/ergonbud/" },
    { title: "Iznotia", url: "https://grumqy.github.io/fangea/wiki/iznotia/" },
    { title: "Mistrzostwa Fangei w Piłce Nożnej 2024", url: "https://grumqy.github.io/fangea/wiki/mistrzostwa_fangei_w_piłce_nożnej_2024/" },
  ];

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(query)
  );

  if (filteredArticles.length > 0) {
    filteredArticles.forEach((article) => {
      const articleElement = document.createElement("div");
      const linkElement = document.createElement("a");
      linkElement.href = article.url;
      linkElement.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i>${article.title}`;
      articleElement.appendChild(linkElement);
      searchResultsList.appendChild(articleElement);
      searchResults.style.display = "block";
      searchContainer.classList.add("active");
    });
  } else {
    const noResultsElement = document.createElement("div");
    noResultsElement.textContent = "Brak wyników";
    noResultsElement.classList = "noresults";
    searchResultsList.appendChild(noResultsElement);
    searchResults.style.display = "block";
    searchContainer.classList.add("active");
  }
}
