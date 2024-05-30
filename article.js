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

console.log(PicturesElements);

console.log(pictures);


let modalContainer = document.createElement("div");
modalContainer.id = "modal-container";
document.body.appendChild(modalContainer);

modalContainer.innerHTML = `
<div class="modal">
<i class="fa-solid fa-xmark"></i>
<div id="modal-gallery-main">
    <ul id="modal-gallery-list">
    </ul>
</div>
<div id="modal-gallery-nav">
    <ul id="modal-gallery-nav-list">
    </ul>
    </div>
  </div>
<div id="modal-overlay"></div>
`;  

document.querySelector(".modal i.fa-solid").addEventListener("click", hideModal);
document.getElementById("modal-overlay").addEventListener("click", hideModal);

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
  showModal();
  }

function showModal(){
document.getElementById("modal-container").classList.add("active");
}
function hideModal(){

document.getElementById("modal-container").classList.add("hidden");
setTimeout(function(){
  document.getElementById("modal-container").classList.remove("active");
  document.getElementById("modal-container").classList.remove("hidden");
}, 250)
}
