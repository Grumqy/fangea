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
    element: element, // Assigning the element property
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
let images = document.querySelectorAll('main article img:not(.icon)');

images.forEach(image => {
    let anchor = document.createElement('a');
    anchor.href = image.src;
    anchor.target = "_blank";
    anchor.appendChild(image.cloneNode(true));
    image.parentNode.replaceChild(anchor, image);
});