import { mainNavStyle } from "./mainNav.js";

const reponse = await fetch("http://localhost:5678/api/works");
const works = await reponse.json();

const categories = new Set();
const divGallery = document.querySelector(".gallery");
const categoriesMenu = document.createElement("div");

function generateWorks(works) {
    for (let i = 0; i < works.length; i++) {
        const work = works[i];

        categories.add(work.category.name);

        const workElement = document.createElement("figure");
        const imageElement = document.createElement("img");
        imageElement.src = work.imageUrl;
        imageElement.alt = work.title;
        const nameElement = document.createElement("figcaption");
        nameElement.textContent = work.title;

        divGallery.appendChild(workElement);
        workElement.appendChild(imageElement);
        workElement.appendChild(nameElement);
    };
};

function generateCategoriesmenu() {
    const portfolio = document.querySelector("#portfolio");
    
    categoriesMenu.setAttribute("id", "categories-menu");
    portfolio.insertBefore(categoriesMenu, divGallery);

    const categoryAll = document.createElement("button");
    categoryAll.textContent = "Tous";
    categoryAll.classList.add("category-button", "active");
    categoriesMenu.appendChild(categoryAll);
    
    categories.forEach((category) => {
        const categoryButton = document.createElement("button");
        categoryButton.textContent = category;
        categoryButton.classList.add("category-button");
        categoriesMenu.appendChild(categoryButton);
    });
};
mainNavStyle();

generateWorks(works);
generateCategoriesmenu();

// Changement couleur quand clic sur catégorie
const categoriesButtons = document.querySelectorAll(".category-button");

document.addEventListener("click", (event) => {
    const isButton = event.target.nodeName === "BUTTON";
    if (!isButton) {
        return
    };

    if (event.target.classList.contains("category-button")) {
        categoriesButtons.forEach(function(button) {
            button.classList.remove("active");
        });
        event.target.classList.add("active");
    };

    if (!(event.target.textContent === "Tous")) {
        const sortedWorks = works.filter(function (work) {
            return work.category.name === event.target.textContent;
        });
        divGallery.innerHTML = "";
        generateWorks(sortedWorks);
    } else {
        divGallery.innerHTML = "";
        generateWorks(works);
    };
});