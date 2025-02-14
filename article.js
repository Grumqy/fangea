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
if (article.classList.contains("noncanonical")){
  var articleBadge = document.createElement("div");
  articleBadge.classList.add("article-badge", "noncanonical");
  articleBadge.innerHTML = 
  `<div class="content">
  <div class="icon">
  <img src="https://i.ibb.co/0FvTnhx/puzell.png">
  </div>
  <div class="text">
      <h2>Ten artykuł nie wpisuje się w kanon roleplay'u.</h2>
      <p>Treść tego artykułu nie dotyczy wydarzeń związanych z roleplay'em. Może mieć charakter informacyjny lub odnosić się do wydarzeń uznawanych za niekanoniczne.</p>
  </div>
  </div>`;
  article.insertBefore(articleBadge, article.querySelector("header").nextSibling);
};
const cleanupSectionsBadges = article.querySelectorAll(".cleanup");
if(cleanupSectionsBadges){
Array.from(cleanupSectionsBadges).forEach(badge=>{
badge.classList.add("article-badge");
badge.innerHTML =   `<div class="content">
<div class="icon">
<img src="https://i.ibb.co/bjbMs2S3/miotla.png">
</div>
<div class="text">
    <h2>Ten artykuł wymaga drobnej korekty.</h2>
    <p>Może to dotyczyć zbyt dużej ilości hiperłączy, złego języka, błędów ortograficznych lub gramatycznych.</p>
</div>
</div>`
};)
const uncompleteSectionsBadges = article.querySelectorAll(".uncomplete");
if(uncompleteSectionsBadges){
Array.from(uncompleteSectionsBadges).forEach(badge=>{
badge.classList.add("article-badge");
badge.innerHTML =   `<div class="content">
<div class="icon">
<img src="https://i.ibb.co/0FvTnhx/puzell.png">
</div>
<div class="text">
    <h2>Ta sekcja jest pusta, niewystarczająco szczegółowa lub niekompletna.</h2>
    <p>Treść wymaga uzupełnienia i poszerzenia, aby dokładniej przedstawić opisywany temat. </p>
</div>
</div>`;
})
}

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

const header = document.querySelector("main article header");
const sourceCodeElement = document.getElementById("source-code");

if (!document.getElementById("article-content") && sourceCodeElement){
  var lastDiv = document.getElementById('source-code');

  var contentDiv = document.createElement('div');
  contentDiv.id = 'article-content';
  
  var currentElement = header.nextElementSibling;
  
  while (currentElement && currentElement !== lastDiv) {
      var nextElement = currentElement.nextElementSibling;
      contentDiv.appendChild(currentElement);
      currentElement = nextElement;
  }
  
  lastDiv.parentNode.insertBefore(contentDiv, lastDiv);
}

const articleContent = document.getElementById("article-content");

const articleTables = Array.from(document.querySelectorAll("article table:not(.infobox, .ibox)"));

articleTables.forEach(table => {
  if (!table.closest('.table-wrapper')) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('table-wrapper'); // Optional: Add a class to the div for styling
    table.parentNode.insertBefore(wrapper, table); // Insert the <div> before the table
    wrapper.appendChild(table); // Append the table inside the <div>
  }
});

console.log(articleTables)

let pictures = Array.from(document.querySelectorAll("main article table.infobox img:not(.icon, .plainlink img)")).map(img => ({
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

let PicturesElements = Array.from(document.querySelectorAll("main article table.infobox img:not(.icon, .plainlink img)")).concat(Array.from(document.querySelectorAll("main article figure")));

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
;

let articleOptionsBar = document.createElement("div");
header.appendChild(articleOptionsBar);

if(sourceCodeElement){

document.getElementById('source-code').innerHTML = document.getElementById('source-code').innerHTML.split('\n').map(line => line.trimStart()).join('\n');

const sourceCode = document.getElementById("source-code").innerHTML;

const readButton = document.createElement("b");
const sourceCodeButton = document.createElement("b");

readButton.innerHTML = 'Czytaj';
sourceCodeButton.innerHTML = 'Kod źródłowy';

readButton.classList.add('active');

readButton.addEventListener('click', switchToRead);
sourceCodeButton.addEventListener('click', switchToSourceCode);

articleOptionsBar.appendChild(readButton);
articleOptionsBar.appendChild(sourceCodeButton);


document.getElementById('source-code').innerHTML = '<pre></pre>';
document.querySelector('#source-code pre').textContent = sourceCode;
sourceCodeElement.innerHTML += '<div id="save-container"><div id="save-article"><i class="fa-solid fa-clipboard" aria-hidden="true"></i> Skopiuj do schowka</div></div>';

function switchToRead(){
  readButton.classList.add("active");
  sourceCodeButton.classList.remove("active");
  articleContent.style.display = 'contents';
  sourceCodeElement.style.display = 'none';
  }
  
  function switchToSourceCode(){
    sourceCodeButton.classList.add("active");
    readButton.classList.remove("active");
    articleContent.style.display = 'none';
    sourceCodeElement.style.display = 'block';
  }
  document.getElementById('save-article').addEventListener('click', copySourceCodeToClipboard);

  function copySourceCodeToClipboard() {
      const el = document.createElement('textarea');
      
      el.value = sourceCode;
      
      el.style.position = 'absolute';
      el.style.left = '-9999px';
  
      document.body.appendChild(el);
      
      const selected =
          document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
      
      el.select();
      
      document.execCommand('copy');
      
      document.body.removeChild(el);
      
      if (selected) {
          document.getSelection().removeAllRanges();
          document.getSelection().addRange(selected);
      }
      document.getElementById('save-article').innerHTML = `<i class="fa-solid fa-check" aria-hidden="true"></i> Skopiowano kod źródłowy`;
      setTimeout(function(){
          document.getElementById('save-article').innerHTML = `<i class="fa-solid fa-clipboard" aria-hidden="true"></i> Skopiuj do schowka`;
      }, 1500)
  }
  

}

const editorButton = document.createElement("a");
editorButton.innerHTML = 'Edytor';
editorButton.target = '_blank';
editorButton.href = 'https://grumqy.github.io/fangea/wiki/edytor/';

articleOptionsBar.appendChild(editorButton);

const imageGroupElements = document.querySelectorAll("article .image-group");

Array.from(imageGroupElements).forEach(element=>{

let imageGroupNavigation = document.createElement("nav");
element.insertBefore(imageGroupNavigation, element.firstChild);
var imageElements = Array.from(element.querySelectorAll("figure"));
imageElements[0].classList.add("active");
let currentIndex = 1;

function setImageGroupNavigation(){
  if(currentIndex == 1){
    imageGroupNavigation.innerHTML = `<span>${currentIndex}/${imageElements.length}</span><i class="fa-solid fa-caret-right"></i>`;
    imageGroupNavigation.querySelector("i.fa-caret-right").addEventListener("click", () => switchImage('right'));
  } else if(currentIndex == imageElements.length){
    imageGroupNavigation.innerHTML = `<i class="fa-solid fa-caret-left"></i><span>${currentIndex}/${imageElements.length}</span>`;
    imageGroupNavigation.querySelector("i.fa-caret-left").addEventListener("click", () => switchImage('left'));
  } else{
    imageGroupNavigation.innerHTML = `<i class="fa-solid fa-caret-left"></i><span>${currentIndex}/${imageElements.length}</span></span><i class="fa-solid fa-caret-right"></i>`;
    imageGroupNavigation.querySelector("i.fa-caret-left").addEventListener("click", () => switchImage('left'));
    imageGroupNavigation.querySelector("i.fa-caret-right").addEventListener("click", () => switchImage('right'));
  }
};

setImageGroupNavigation();

function switchImage(direction){

  imageElements.forEach(element=>{
  element.classList.remove('active');
  })
  
if(direction == 'left'){
currentIndex--;
imageElements[currentIndex-1].classList.add("active");

} else{
currentIndex++;
imageElements[currentIndex-1].classList.add("active");
}
setImageGroupNavigation();
}
});
