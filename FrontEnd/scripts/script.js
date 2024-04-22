const reponse = await fetch("http://localhost:5678/api/works");
const works = await reponse.json();

function generateWorks(works) {
    for (let i = 0; i < works.length; i++) {
        const figure = works[i];
        const divGallery = document.querySelector(".gallery");
        const workElement = document.createElement("figure");
        const imageElement = document.createElement("img");
        imageElement.src = figure.imageUrl;
        imageElement.alt = figure.title;
        const nameElement = document.createElement("figcaption");

        divGallery.appendChild(workElement);
        workElement.appendChild(imageElement);
        workElement.appendChild(nameElement);
    }
}

generateWorks(works);