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
                  <li><a href="https://grumqy.github.io/fangea/radio/"><i class="fa-solid fa-radio"></i><span>Radio</span></a></li>
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
    { title: "Artykuł dla początkujących wolontariuszy", url: "https://grumqy.github.io/fangea/wiki/artykuł_dla_początkujacych_wolontariuszy/" },
    { title: "Montecydia", url: "https://grumqy.github.io/fangea/wiki/montecydia" },
    { title: "Richteryzm", url: "https://grumqy.github.io/fangea/wiki/richteryzm" },
    { title: "Wojna domowa w Wizgardzie", url: "https://grumqy.github.io/fangea/wiki/wojna_domowa_w_wizgardzie/" },
    { title: "Lemburg", url: "https://grumqy.github.io/fangea/wiki/lemburg/" },
    { title: "Ergonbud", url: "https://grumqy.github.io/fangea/wiki/ergonbud/" },
    { title: "Iznotia", url: "https://grumqy.github.io/fangea/wiki/iznotia/" },
    { title: "Atidalia", url: "https://grumqy.github.io/fangea/wiki/atidalia/" },
    { title: "Ebengrad", url: "https://grumqy.github.io/fangea/wiki/ebengrad/" },
    { title: "Pamercja", url: "https://grumqy.github.io/fangea/wiki/pamercja/" },
    { title: "Nowy Tuhalf", url: "https://grumqy.github.io/fangea/wiki/nowy_tuhalf/" },
    { title: "Stany Zjednoczone", url: "https://grumqy.github.io/fangea/wiki/stany_zjednoczone/" },
    { title: "Halandia", url: "https://grumqy.github.io/fangea/wiki/halandia/" },
    { title: "Mistrzostwa Fangei w Piłce Nożnej 2024", url: "https://grumqy.github.io/fangea/wiki/mistrzostwa_fangei_w_piłce_nożnej_2024/" },
    { title: "Greenpay", url: "https://grumqy.github.io/fangea/wiki/greenpay/" },
    { title: "Shot Paste", url: "https://grumqy.github.io/fangea/wiki/shot_paste/" },
    { title: "Powstanie Ekwalijskie", url: "https://grumqy.github.io/fangea/wiki/powstanie_ekwalijskie/" },
    { title: "Pameryjskie tablice rejestracyjne", url: "https://grumqy.github.io/fangea/wiki/pameryjskie_tablice_rejestracyjne/" },
    { title: "Teran", url: "https://grumqy.github.io/fangea/wiki/teran/" },
    { title: "Taj-Hoi", url: "https://grumqy.github.io/fangea/wiki/taj-hoi/" },
    { title: "Martylia", url: "https://grumqy.github.io/fangea/wiki/martylia/" },
    { title: "Liwonia", url: "https://grumqy.github.io/fangea/wiki/liwonia/" },
    { title: "Hierarchia dróg", url: "https://grumqy.github.io/fangea/wiki/hierarchia_dróg/" },
    { title: "Monteverische Ordnung (Montecydyjski Ład)", url: "https://grumqy.github.io/fangea/wiki/montecydyjski_ład/" },
    { title: "Neku", url: "https://grumqy.github.io/fangea/wiki/neku/" },
    { title: "MMT Transport", url: "https://grumqy.github.io/fangea/wiki/mmt_transport/" },
    { title: "Flaga Lemburga", url: "https://grumqy.github.io/fangea/wiki/flaga_lemburga/" },
    { title: "Herb Lemburga", url: "https://grumqy.github.io/fangea/wiki/herb_lemburga/" },
    { title: "Historia flag Fangei", url: "https://grumqy.github.io/fangea/wiki/historia_flag_fangei/" },
    { title: "FARNET", url: "https://grumqy.github.io/fangea/wiki/farnet" },
    { title: "Epsilon 3.1", url: "https://grumqy.github.io/fangea/wiki/epsilon_3.1" },
    { title: "DOMA", url: "https://grumqy.github.io/fangea/wiki/doma" },
              

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
