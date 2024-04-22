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

        divGallery.appendChild(workElement);
        workElement.appendChild(imageElement);
        workElement.appendChild(nameElement);
    }
   generateCategoriesmenu();
}

function generateCategoriesmenu() {
    const portfolio = document.querySelector("#portfolio");
    //const categoriesMenu = document.createElement("div");
    
    categoriesMenu.setAttribute("id", "categories-menu");
    portfolio.insertBefore(categoriesMenu, divGallery);

    const categoryAll = document.createElement("button");
    categoryAll.textContent = "Tous";
    //categoryAll.setAttribute("id", "all");
    categoriesMenu.appendChild(categoryAll);
    
    categories.forEach((category) => {
        const categoryButton = document.createElement("button");
        categoryButton.textContent = category;
        //const categoryIdName = category.replaceAll(' ', '-').toLowerCase();
        //categoryButton.setAttribute("id", categoryIdName);
        categoriesMenu.appendChild(categoryButton);
    });
}

generateWorks(works);

categoriesMenu.addEventListener("click", (event) => {
    const isButton = event.target.nodeName === "BUTTON";
    if (!isButton) {
        return
    }

    if (!(event.target.textContent === "Tous")) {
        const sortedWorks = works.filter(function (work) {
            return work.category.name === event.target.textContent;
        })
        categoriesMenu.innerHTML = "";
        divGallery.innerHTML = "";
        generateWorks(sortedWorks);
    } else {
        categoriesMenu.innerHTML = "";
        divGallery.innerHTML = "";
        generateWorks(works);
    }
})