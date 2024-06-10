const article = document.querySelector("article");
if (article.classList.contains("awarded")){
var articleBadge = document.createElement("div");
articleBadge.classList.add("article-badge", "awarded");
articleBadge.innerHTML = 
`<div class="content">
<div class="icon">
    <img src="https://i.ibb.co/6y7BBC6/order.png">
</div>
<div class="text">
    <h2>Artykuł na medal</h2>
    <p>Ten artykuł został wyróżniony statusem „Artykuł na Medal”. Wyczerpuje opisywany temat i jest bogaty w treść.</p>
</div>
</div>`;
article.insertBefore(articleBadge, article.querySelector("header").nextSibling);
};
if (article.classList.contains("outdated")){
  var articleBadge = document.createElement("div");
  articleBadge.classList.add("article-badge", "outdated");
  articleBadge.innerHTML = 
  `<div class="content">
  <div class="icon">
  <img src="https://i.ibb.co/5hqmRX0/znakzapytania.png">
  </div>
  <div class="text">
      <h2>Ten artykuł wymaga zweryfikowania podanych informacji.</h2>
      <p>Część lub nawet wszystkie informacje w artykule mogą być nieprawdziwe lub nieaktualne. Artykuł wymaga zweryfikowania i zaktualizowania treści.</p>
  </div>
  </div>`;
  article.insertBefore(articleBadge, article.querySelector("header").nextSibling);
};
if (article.classList.contains("improvable")){
  var articleBadge = document.createElement("div");
  articleBadge.classList.add("article-badge", "improvable");
  articleBadge.innerHTML = 
  `<div class="content">
  <div class="icon">
  <img src="https://i.ibb.co/DRJpQRS/flaga.png">
  </div>
  <div class="text">
      <h2>Ten artykuł jest napisany niepoprawnie.</h2>
      <p>Treść tego artykułu nie spełnia norm języka polskiego. Artykuł jest niepoprawny i wymaga całkowitego lub częściowego napisania od nowa.</p>
  </div>
  </div>`;
  article.insertBefore(articleBadge, article.querySelector("header").nextSibling);
};

let headings = document.querySelectorAll("main article h1");
let navigation = document.querySelector("main nav ul");

let sections = [];

function getSectionPosition(element) {
  var rect = element.getBoundingClientRect();
  var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return rect.top + scrollTop - 80;
}

Array.from(headings).forEach((element) => {
  let section = {
    name: element.textContent,
    position: getSectionPosition(element),
    element: element,
  };
  sections.push(section);
});

sections.forEach((section) => {
  let listItem = document.createElement("li");
  listItem.textContent = section.name;
  navigation.appendChild(listItem);
  listItem.addEventListener("click", function () {
    window.scrollTo({
      top: section.position,
      behavior: "smooth",
    });
  });
});

let pictures = Array.from(document.querySelectorAll("main article table.infobox img:not(.icon)")).map(img => ({
  src: img.src,
  description: img.dataset.description
})).concat(Array.from(document.querySelectorAll("main article figure")).map(figure => {
  let img = figure.querySelector("img");
  let figcaption = figure.querySelector("figcaption");
  return {
      src: img ? img.src : "",
      description: figcaption ? figcaption.innerHTML.trim() : ""
  };
}));

let PicturesElements = Array.from(document.querySelectorAll("main article table.infobox img:not(.icon)")).concat(Array.from(document.querySelectorAll("main article figure")));

PicturesElements.forEach((element,index) =>{
element.addEventListener("click", () => selectGalleryItem(index));
})

function createModalContainer(){
  var modalContainer = document.createElement("div");
  modalContainer.id = "modal-container";
  modalContainer.innerHTML = '<div id="modal-overlay"></div>';
  document.body.appendChild(modalContainer);
}
createModalContainer();

function createModalWindow(id, innerhtml){
  var modal = document.createElement("div");
  modal.classList.add("modal");
  modal.id = id;
  modal.innerHTML = '<i class="fa-solid fa-xmark modal-close"></i>' + innerhtml;
  document.getElementById("modal-container").appendChild(modal);

  // Fix: pass the hideModal function as a reference, not invoke it immediately
  document.getElementById(id).querySelector('.modal-close').addEventListener("click", () => hideModal(id));
  document.getElementById("modal-overlay").addEventListener("click", () => hideModal('any'));
}

const articlePhotosGalleryInnerhtml = `
<div id="modal-gallery-main">
    <ul id="modal-gallery-list">
    </ul>
</div>
<div id="modal-gallery-nav">
    <ul id="modal-gallery-nav-list">
    </ul>
    </div>
`;

createModalWindow('article-photos-gallery', articlePhotosGalleryInnerhtml);

pictures.forEach((picture, index) => {
let galleryItem = document.createElement("li");
galleryItem.classList.add("modal-gallery-item");
galleryItem.dataset.index = index;
galleryItem.innerHTML = `<div class="modal-gallery-item-image"><img src="${picture.src}"></div>
<div class="modal-gallery-item-description">${picture.description}</div>`;

document.getElementById("modal-gallery-list").appendChild(galleryItem);

let navItem = document.createElement("li");
navItem.classList.add("modal-gallery-nav-item");
navItem.dataset.index = index;
navItem.innerHTML = `<img src="${picture.src}">`;
navItem.addEventListener("click", () => selectGalleryItem(index));
document.getElementById("modal-gallery-nav-list").appendChild(navItem);

})

let galleryItems = Array.from(document.querySelectorAll("ul#modal-gallery-list li.modal-gallery-item"));
let galleryNavItems = Array.from(document.querySelectorAll("ul#modal-gallery-nav-list li.modal-gallery-nav-item"));

function selectGalleryItem(index){
  galleryItems.forEach(element => {
  element.classList.remove("active");
  galleryItems[index].classList.add("active");
  })
  galleryNavItems.forEach(element => {
  element.classList.remove("active");
  galleryNavItems[index].classList.add("active");
  })
  showModal('article-photos-gallery');
  }

function showModal(id){
document.getElementById("modal-container").classList.add("active");
document.getElementById(id).classList.add("active");
}
function hideModal(id) {
  console.log("Closing modal");
  document.getElementById("modal-container").classList.add("hidden");
  setTimeout(function() {
      document.getElementById("modal-container").classList.remove("active");
      document.getElementById("modal-container").classList.remove("hidden");
      if (id !== 'any') {
          document.getElementById(id).classList.remove("active");
      } else {
          Array.from(document.getElementById("modal-container").querySelectorAll(".modal")).forEach(modal => {
              modal.classList.remove("active");
          });
      }
  }, 250);
}

function setModalOpener(modalId, openerId){
document.getElementById(openerId).addEventListener("click", () => showModal(modalId));
}
